<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\SellerKyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KycController extends Controller
{
    /**
     * Display list of KYC applications
     */
    public function index(Request $request)
    {
        $kycs = SellerKyc::with(['seller:id,shop_name,user_id', 'seller.user:id,name,email'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->search, function ($query, $search) {
                $query->whereHas('seller', function ($q) use ($search) {
                    $q->where('shop_name', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'pending' => SellerKyc::where('status', 'pending')->count(),
            'approved' => SellerKyc::where('status', 'approved')->count(),
            'rejected' => SellerKyc::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Kyc/Index', [
            'kycs' => $kycs,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Show single KYC application for review
     */
    public function show(SellerKyc $kyc)
    {
        $kyc->load([
            'seller:id,shop_name,description,business_type,business_registration_number,phone,address,status,created_at',
            'seller.user:id,name,email,phone,created_at',
            'reviewer:id,name',
        ]);

        return Inertia::render('Admin/Kyc/Show', [
            'kyc' => $kyc,
            'documentUrls' => [
                'id_front' => $kyc->id_front_path ? Storage::disk('private')->temporaryUrl($kyc->id_front_path, now()->addMinutes(30)) : null,
                'id_back' => $kyc->id_back_path ? Storage::disk('private')->temporaryUrl($kyc->id_back_path, now()->addMinutes(30)) : null,
                'selfie' => $kyc->selfie_path ? Storage::disk('private')->temporaryUrl($kyc->selfie_path, now()->addMinutes(30)) : null,
                'business_document' => $kyc->business_document_path ? Storage::disk('private')->temporaryUrl($kyc->business_document_path, now()->addMinutes(30)) : null,
            ],
        ]);
    }

    /**
     * Approve KYC application
     */
    public function approve(Request $request, SellerKyc $kyc)
    {
        if ($kyc->status !== 'pending') {
            return back()->with('error', 'This KYC application has already been processed.');
        }

        $kyc->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        // Update seller status to approved
        $kyc->seller->update([
            'status' => 'approved',
            'is_verified' => true,
        ]);

        // TODO: Send approval email to seller

        return redirect()->route('admin.kyc.index')
            ->with('success', "Seller '{$kyc->seller->shop_name}' has been approved!");
    }

    /**
     * Reject KYC application
     */
    public function reject(Request $request, SellerKyc $kyc)
    {
        if ($kyc->status !== 'pending') {
            return back()->with('error', 'This KYC application has already been processed.');
        }

        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $kyc->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Update seller status
        $kyc->seller->update([
            'status' => 'rejected',
        ]);

        // TODO: Send rejection email to seller with reason

        return redirect()->route('admin.kyc.index')
            ->with('success', "KYC application for '{$kyc->seller->shop_name}' has been rejected.");
    }

    /**
     * Request additional documents
     */
    public function requestDocuments(Request $request, SellerKyc $kyc)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $kyc->update([
            'status' => 'documents_requested',
            'rejection_reason' => $validated['message'],
        ]);

        $kyc->seller->update([
            'status' => 'documents_requested',
        ]);

        // TODO: Send email requesting additional documents

        return back()->with('success', 'Request for additional documents has been sent.');
    }
}
