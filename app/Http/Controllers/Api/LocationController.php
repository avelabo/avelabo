<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\Region;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    /**
     * Get all active countries
     */
    public function countries(): JsonResponse
    {
        $countries = Country::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'code_2', 'phone_code']);

        return response()->json($countries);
    }

    /**
     * Get regions for a specific country
     */
    public function regions(Country $country): JsonResponse
    {
        $regions = $country->regions()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return response()->json($regions);
    }

    /**
     * Get cities for a specific region
     */
    public function cities(Region $region): JsonResponse
    {
        $cities = $region->cities()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($cities);
    }

    /**
     * Get delivery cities for Malawi (the only country we deliver to)
     * Returns cities with their region information for display
     */
    public function deliveryCities(): JsonResponse
    {
        $malawi = Country::where('code', 'MWI')->first();

        if (! $malawi) {
            return response()->json([]);
        }

        $cities = City::query()
            ->whereHas('region', function ($query) use ($malawi) {
                $query->where('country_id', $malawi->id);
            })
            ->with('region:id,name,code')
            ->active()
            ->deliveryAvailable()
            ->orderBy('name')
            ->get(['id', 'region_id', 'name']);

        // Format cities with region info
        $formattedCities = $cities->map(fn ($city) => [
            'id' => $city->id,
            'name' => $city->name,
            'region_id' => $city->region_id,
            'region_name' => $city->region->name,
            'region_code' => $city->region->code,
        ]);

        return response()->json($formattedCities);
    }
}
