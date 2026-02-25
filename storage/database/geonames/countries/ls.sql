<?php

/*
|--------------------------------------------------------------------------
| Optimized CityController + Blade (Single Page)
|--------------------------------------------------------------------------
*/

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $page   = $request->get('page', 1);
        $search = $request->get('search', null);

        // کلید کش هر صفحه و جستجو جدا
        $cacheKey = "cities_{$locale}_LR_page_{$page}" . ($search ? "_search_" . md5($search) : "");

        $cities = Cache::remember($cacheKey, 86400, function () use ($locale, $search) {
            $query = City::with(['translation' => fn($q) => $q->where('locale', $locale)])
                         ->where('country_code', 'LR')
                         ->where('active', 1);

            if ($search) {
                $query->whereHas('translations', function ($q) use ($locale, $search) {
                    $q->where('locale', $locale)
                      ->where('name', 'like', "%{$search}%");
                });
            }

            return $query->paginate(50);
        });

        // Blade output
        echo '<div class="container">';
        echo '<h1>لیست شهرها</h1>';

        // فرم جستجو
        echo '<form method="GET" class="mb-4">';
        echo '<input type="text" name="search" value="' . ($search ?? '') . '" placeholder="جستجو شهر..." class="px-3 py-2 border rounded w-full md:w-1/3">';
        echo '<button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">جستجو</button>';
        echo '</form>';

        // لیست شهرها
        echo '<div id="cities-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        foreach ($cities as $city) {
            echo '<div class="p-3 border rounded shadow-sm">';
            echo '<strong>' . (optional($city->translation)->name ?? '-') . '</strong>';
            echo '<p>جمعیت: ' . ($city->population ?? '-') . '</p>';
            echo '<p>مختصات: ' . ($city->latitude ?? '-') . ', ' . ($city->longitude ?? '-') . '</p>';
            echo '</div>';
        }
        echo '</div>';

        // Pagination
        echo '<div class="mt-4">';
        echo $cities->withQueryString()->links();
        echo '</div>';

        echo '</div>';
    }
}
