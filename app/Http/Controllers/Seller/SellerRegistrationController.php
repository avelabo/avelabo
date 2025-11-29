<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Seller;
use App\Models\SellerKyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SellerRegistrationController extends Controller
{
    /**
     * Show seller registration / become a seller page
     */
    public function create()
    {
        $user = Auth::user();

        // If user already has a seller account, redirect to dashboard
        if ($user->seller) {
            return redirect()->route('seller.dashboard');
        }

        return Inertia::render('Seller/Register', [
            'user' => $user->only(['id', 'name', 'email', 'phone']),
        ]);
    }

    /**
     * Store new seller application
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Prevent duplicate seller accounts
        if ($user->seller) {
            return redirect()->route('seller.dashboard')
                ->with('error', 'You already have a seller account.');
        }

        $validated = $request->validate([
            'shop_name' => ['required', 'string', 'max:255'],
            'shop_description' => ['nullable', 'string', 'max:1000'],
            'business_type' => ['required', 'in:individual,business'],
            'business_registration_number' => ['nullable', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'city_id' => ['nullable', 'exists:cities,id'],
        ]);

        DB::transaction(function () use ($user, $validated) {
            // Create seller record
            $seller = Seller::create([
                'user_id' => $user->id,
                'shop_name' => $validated['shop_name'],
                'slug' => Str::slug($validated['shop_name']) . '-' . Str::random(5),
                'description' => $validated['shop_description'] ?? null,
                'business_type' => $validated['business_type'],
                'business_registration_number' => $validated['business_registration_number'] ?? null,
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
                'city_id' => $validated['city_id'] ?? null,
                'status' => 'pending', // Awaiting KYC
            ]);

            // Update user phone if provided
            if (!$user->phone && $validated['phone']) {
                $user->update(['phone' => $validated['phone']]);
            }

            // Assign seller role
            $sellerRole = Role::where('slug', 'seller')->first();
            if ($sellerRole) {
                $user->roles()->syncWithoutDetaching([$sellerRole->id]);
            }
        });

        return redirect()->route('seller.kyc.create')
            ->with('success', 'Shop profile created! Please complete KYC verification.');
    }

    /**
     * Show KYC document upload form
     */
    public function showKycForm()
    {
        $user = Auth::user();
        $seller = $user->seller;

        if (!$seller) {
            return redirect()->route('seller.register')
                ->with('error', 'Please create your shop profile first.');
        }

        // Check if KYC already submitted
        $existingKyc = $seller->kyc;

        return Inertia::render('Seller/Kyc', [
            'seller' => $seller->only(['id', 'shop_name', 'status']),
            'existingKyc' => $existingKyc ? $existingKyc->only(['id', 'status', 'rejection_reason', 'created_at']) : null,
            'documentTypes' => [
                'national_id' => 'National ID',
                'passport' => 'Passport',
                'drivers_license' => 'Driver\'s License',
            ],
        ]);
    }

    /**
     * Store KYC documents
     */
    public function storeKyc(Request $request)
    {
        $user = Auth::user();
        $seller = $user->seller;

        if (!$seller) {
            return redirect()->route('seller.register')
                ->with('error', 'Please create your shop profile first.');
        }

        // Check if KYC is already approved
        if ($seller->kyc && $seller->kyc->status === 'approved') {
            return redirect()->route('seller.dashboard')
                ->with('error', 'Your KYC has already been approved.');
        }

        $validated = $request->validate([
            'document_type' => ['required', 'in:national_id,passport,drivers_license'],
            'id_front' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'id_back' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'selfie' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'business_document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        // Store files securely
        $idFrontPath = $request->file('id_front')->store("kyc/{$seller->id}", 'private');
        $idBackPath = $request->hasFile('id_back')
            ? $request->file('id_back')->store("kyc/{$seller->id}", 'private')
            : null;
        $selfiePath = $request->file('selfie')->store("kyc/{$seller->id}", 'private');
        $businessDocPath = $request->hasFile('business_document')
            ? $request->file('business_document')->store("kyc/{$seller->id}", 'private')
            : null;

        // Create or update KYC record
        $kyc = SellerKyc::updateOrCreate(
            ['seller_id' => $seller->id],
            [
                'document_type' => $validated['document_type'],
                'id_front_path' => $idFrontPath,
                'id_back_path' => $idBackPath,
                'selfie_path' => $selfiePath,
                'business_document_path' => $businessDocPath,
                'status' => 'pending',
                'rejection_reason' => null,
                'submitted_at' => now(),
            ]
        );

        // Update seller status
        $seller->update(['status' => 'pending_kyc']);

        return redirect()->route('seller.kyc.status')
            ->with('success', 'KYC documents submitted successfully! We will review them shortly.');
    }

    /**
     * Show KYC status page
     */
    public function kycStatus()
    {
        $user = Auth::user();
        $seller = $user->seller;

        if (!$seller) {
            return redirect()->route('seller.register');
        }

        $kyc = $seller->kyc;

        return Inertia::render('Seller/KycStatus', [
            'seller' => $seller->only(['id', 'shop_name', 'status']),
            'kyc' => $kyc ? $kyc->only(['id', 'status', 'rejection_reason', 'submitted_at', 'reviewed_at']) : null,
        ]);
    }
}
