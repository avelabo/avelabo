<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Seeds the default Takealot seller as the primary system seller.
     * This seller will be active and ready to receive scraped products.
     */
    public function up(): void
    {
        // Get required foreign key IDs
        $zarCurrency = DB::table('currencies')->where('code', 'ZAR')->first();
        $mwkCurrency = DB::table('currencies')->where('code', 'MWK')->first();
        $saCountry = DB::table('countries')->where('code', 'ZAF')->first();
        $mwCountry = DB::table('countries')->where('code', 'MWI')->first();

        // Use ZAR/South Africa if available, fallback to MWK/Malawi
        $currencyId = $zarCurrency?->id ?? $mwkCurrency?->id;
        $countryId = $saCountry?->id ?? $mwCountry?->id;

        if (!$currencyId || !$countryId) {
            throw new \RuntimeException('Required currencies and countries must be seeded before running this migration.');
        }

        $now = now();

        // Check if Takealot user already exists
        $existingUser = DB::table('users')->where('email', 'takealot@system.avelabo.com')->first();

        if (!$existingUser) {
            // Create the Takealot system user
            $userId = DB::table('users')->insertGetId([
                'name' => 'Takealot System',
                'email' => 'takealot@system.avelabo.com',
                'password' => Hash::make(bin2hex(random_bytes(16))), // Random secure password
                'email_verified_at' => $now,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        } else {
            $userId = $existingUser->id;
        }

        // Check if Takealot seller already exists
        $existingSeller = DB::table('sellers')->where('slug', 'takealot')->first();

        if (!$existingSeller) {
            // Create the Takealot seller
            $sellerId = DB::table('sellers')->insertGetId([
                'user_id' => $userId,
                'shop_name' => 'Takealot',
                'display_name' => 'Takealot',
                'slug' => 'takealot',
                'description' => "Products from Takealot.com - South Africa's leading online retailer. Shop with confidence knowing your orders are sourced from trusted suppliers and delivered to your doorstep in Malawi.",
                'logo' => null,
                'banner' => null,
                'business_type' => 'company',
                'business_name' => 'Takealot Online (Pty) Ltd',
                'business_registration_number' => null,
                'default_currency_id' => $currencyId,
                'country_id' => $countryId,
                'markup_template_id' => null,
                'status' => 'active',
                'show_seller_name' => false, // Products show under Avelabo brand
                'has_storefront' => false,   // No public storefront page
                'rating' => 4.50,
                'total_reviews' => 0,
                'total_products' => 0,
                'total_sales' => 0,
                'is_verified' => true,
                'is_featured' => true,
                'source' => 'takealot',
                'source_id' => 'takealot-system',
                'commission_rate' => 0.00, // System seller - no commission
                'approved_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // Create approved KYC for the seller
            DB::table('seller_kyc')->insert([
                'seller_id' => $sellerId,
                'document_type' => 'national_id',
                'id_front_path' => 'kyc/system/takealot_verification.pdf',
                'id_back_path' => null,
                'selfie_path' => 'kyc/system/takealot_verification.pdf',
                'business_registration_path' => 'kyc/system/takealot_business.pdf',
                'tax_certificate_path' => null,
                'status' => 'approved',
                'rejection_reason' => null,
                'admin_notes' => 'System seller - automatically approved',
                'reviewed_by' => null,
                'submitted_at' => $now,
                'reviewed_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Get the seller
        $seller = DB::table('sellers')->where('slug', 'takealot')->first();

        if ($seller) {
            // Delete KYC record
            DB::table('seller_kyc')->where('seller_id', $seller->id)->delete();

            // Delete seller
            DB::table('sellers')->where('id', $seller->id)->delete();

            // Delete system user
            DB::table('users')->where('email', 'takealot@system.avelabo.com')->delete();
        }
    }
};
