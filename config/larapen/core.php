<?php
/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

return [

    /*
    |--------------------------------------------------------------------------
    | The item's info on CodeCanyon
    |--------------------------------------------------------------------------
    */
    'item' => [
        'id'    => '16458425',
        'name'  => 'LaraClassifier',
        'title' => 'Classified Ads Web Application',
        'slug'  => 'laraclassifier',
        'url'   => 'https://laraclassifier.com/',
    ],

    /*
    |--------------------------------------------------------------------------
    | Purchase code checker URL
    |--------------------------------------------------------------------------
    */
    'purchaseCodeCheckerUrl' => 'https://api.bedigit.com/envato.php?purchase_code=',
    'purchaseCodeFindingUrl' => 'https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code',

    /*
    |--------------------------------------------------------------------------
    | Purchase Code
    |--------------------------------------------------------------------------
    */
    'purchaseCode' => env('PURCHASE_CODE', ''),

    /*
    |--------------------------------------------------------------------------
    | Demo Website Info
    |--------------------------------------------------------------------------
    */
    'demo' => [
        'domain' => 'laraclassifier.com',
        'hosts'  => [
            'laraclassified.bedigit.com',
            'demo.laraclassifier.com',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | App's Charset
    |--------------------------------------------------------------------------
    */
    'charset' => env('CHARSET', 'utf-8'),

    /*
    |--------------------------------------------------------------------------
    | Database Charset & Collation
    |--------------------------------------------------------------------------
    */
    'database' => [
        'encoding' => [
            'default' => [
                'charset'   => 'utf8mb4',
                'collation' => 'utf8mb4_unicode_ci',
            ],
            'recommended' => [
                'utf8mb4' => ['utf8mb4_0900_ai_ci', 'utf8mb4_unicode_ci', 'utf8mb4_general_ci'],
                'utf8mb3' => ['utf8mb3_unicode_ci', 'utf8mb3_general_ci'],
                'utf8'    => ['utf8_unicode_ci', 'utf8_general_ci'],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Modules Base Paths
    |--------------------------------------------------------------------------
    */
    'basePath' => [
        'admin'   => env('ADMIN_BASE_PATH', 'admin'),
        'auth'    => env('AUTH_BASE_PATH', 'auth'),
        'account' => env('ACCOUNT_BASE_PATH', 'account'),
    ],

    /*
    |--------------------------------------------------------------------------
    | JavaScript/jQuery plugins config
    |--------------------------------------------------------------------------
    */
    'fileinput' => ['theme' => 'bs5'],
    'select2'   => ['theme' => 'bootstrap5'],

    /*
    |--------------------------------------------------------------------------
    | TextToImage settings
    |--------------------------------------------------------------------------
    */
    'textToImage' => [
        'format'          => 'png',
        'color'           => '#FFFFFF',
        'backgroundColor' => 'transparent',
        'fontFamily'      => 'FiraSans-Regular.ttf',
        'boldFontFamily'  => 'FiraSans-SemiBold.ttf',
        'fontSize'        => 13,
        'padding'         => 0,
        'shadowEnabled'   => false,
        'shadowColor'     => '#666666',
        'shadowOffsetX'   => 1,
        'shadowOffsetY'   => 1,
        'quality'         => 100,
        'retinaEnabled'   => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Countries SVG maps folder & URL base
    |--------------------------------------------------------------------------
    */
    'maps' => [
        'path'    => public_path('images/maps') . DIRECTORY_SEPARATOR,
        'urlBase' => 'images/maps/',
    ],

    /*
    |--------------------------------------------------------------------------
    | Icon set of the current version of the main icons fonts
    |--------------------------------------------------------------------------
    */
    'defaultFontIconSet' => 'bootstrapfontawesome',
    'fontIconSet' => [
        'bootstrap' => [
            'version' => '1.13.1',
            'key'     => 'bootstrapicons',
            'path'    => public_path('assets/plugins/bootstrap-iconpicker/js/iconset/iconset-bootstrapicons-all.js'),
        ],
        'fontawesome' => [
            'version' => '6.5.2',
            'key'     => 'fontawesome6',
            'path'    => public_path('assets/plugins/bootstrap-iconpicker/js/iconset/iconset-fontawesome6-all.js'),
        ],
        'bootstrapfontawesome' => [
            'version' => 'current',
            'key'     => 'bootstrapfontawesome',
            'path'    => public_path('assets/plugins/bootstrap-iconpicker/js/iconset/iconset-bootstrapfontawesome-all.js'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO and URLs
    |--------------------------------------------------------------------------
    */
    'multiCountryUrls' => env('MULTI_COUNTRY_URLS', false),
    'forceHttps'       => env('FORCE_HTTPS', false),

    /*
    |--------------------------------------------------------------------------
    | Headers - No Cache during redirect
    |--------------------------------------------------------------------------
    */
    'noCacheHeaders' => [
        'Cache-Control' => 'no-store, no-cache, must-revalidate',
        'Pragma'        => 'no-cache',
        'Expires'       => 'Sun, 02 Jan 1990 05:00:00 GMT',
        'Last-Modified' => gmdate('D, d M Y H:i:s') . ' GMT',
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance & Debug
    |--------------------------------------------------------------------------
    */
    'performance' => [
        'preventLazyLoading' => env('PREVENT_LAZY_LOADING', false),
        'httpRequestTimeout' => env('HTTP_REQUEST_TIMEOUT', 1),
    ],
    'debugBar' => env('DEBUG_BAR', false),

    /*
    |--------------------------------------------------------------------------
    | User Language Storage
    |--------------------------------------------------------------------------
    */
    'storingUserSelectedLang' => 'cookie',

    /*
    |--------------------------------------------------------------------------
    | Plugins Path & Namespace
    |--------------------------------------------------------------------------
    */
    'plugin' => [
        'path'      => base_path('extras/plugins') . DIRECTORY_SEPARATOR,
        'namespace' => '\\extras\\plugins\\',
    ],

    'dmCountriesListAsHomepage' => env('DM_COUNTRIES_LIST_AS_HOMEPAGE'),

    /*
    |--------------------------------------------------------------------------
    | Managing User's Fields
    |--------------------------------------------------------------------------
    */
    'disable' => [
        'username' => env('DISABLE_USERNAME', true),
    ],

    'displayBothAuthFields' => env('DISPLAY_BOTH_AUTH_FIELDS', true),
    'locationCodePrefix'    => 'Z',
    'sendNotificationOnError' => env('SEND_NOTIFICATION_ON_ERROR', false),

    /*
    |--------------------------------------------------------------------------
    | Date & Datetime Format
    |--------------------------------------------------------------------------
    */
    'dateFormat' => [
        'default' => 'YYYY-MM-DD',
        'php'     => 'Y-m-d',
    ],
    'datetimeFormat' => [
        'default' => 'YYYY-MM-DD HH:mm',
        'php'     => 'Y-m-d H:i',
    ],

    'hashableIdPrefix' => env('HASHABLE_ID_PREFIX', ''),
    'maintenanceIpAddresses' => array_map('trim', explode(',', env('MAINTENANCE_IP_ADDRESSES') ?? '')),
    'ipLinkBase' => env('IP_LINK_BASE', 'https://whatismyipaddress.com/ip/'),

    /*
    |--------------------------------------------------------------------------
    | API & Web Guard
    |--------------------------------------------------------------------------
    */
    'api' => [
        'token' => env('APP_API_TOKEN'),
    ],
    'web' => [
        'guard' => env('AUTH_GUARD', 'web'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Packages Options
    |--------------------------------------------------------------------------
    */
    'package' => [
        'type' => [
            'promotion'    => 'App\Models\Post',
            'subscription' => 'App\Models\User',
        ],
    ],

    'forceNonSecureUpgrade' => env('FORCE_NON_SECURE_UPGRADE'),

    'maxItemsPerPage' => [
        'global'   => env('DEFAULT_MAX_ITEMS_PER_PAGE'),
        'listings' => env('DEFAULT_MAX_LISTINGS_PER_PAGE'),
    ],

];