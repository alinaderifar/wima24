<?php

/*
|--------------------------------------------------------------------------
| CONTROLLER + VIEW OPTIMIZED (ONE PAGE)
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

        $cacheKey = "cities_{$locale}_LR_page_{$page}" . ($search ? "_search_" . md5($search) : "");

        $cities = Cache::remember($cacheKey, 86400, function () use ($locale, $search) {
            $query = City::with(['translation' => fn($q) => $q->where('locale', $locale)])
                        ->where('country_code', 'LR')
                        ->where('active', 1);

            if ($search) {
                // استفاده از fulltext اگر موجود است، در غیر این صورت LIKE
                $query->whereHas('translations', function ($q) use ($locale, $search) {
                    $q->where('locale', $locale)
                      ->where('name', 'like', "%{$search}%");
                });
            }

            return $query->paginate(50);
        });

        return view('cities.index', compact('cities', 'search'));
    }
}

