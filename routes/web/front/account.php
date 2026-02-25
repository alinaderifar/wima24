<?php

use App\Http\Controllers\Web\Front\Account\{
    ClosingController,
    LinkedAccountsController,
    MessagesController,
    OverviewController,
    PostsController,
    PreferencesController,
    ProfileController,
    SavedPostsController,
    SavedSearchesController,
    SecurityController,
    SubscriptionController,
    TransactionsController
};
use Illuminate\Support\Facades\Route;

$accountMiddlewares = ['auth', 'twoFactor', 'banned.user', 'no.http.cache'];
$disableImpersonation = ['impersonate.protect'];

// ======================== ACCOUNT ROUTES ========================
Route::middleware($accountMiddlewares)->group(function () use ($disableImpersonation) {

    // Overview
    Route::get('overview', [OverviewController::class, 'index']);

    // Profile
    Route::prefix('profile')->controller(ProfileController::class)->group(function () use ($disableImpersonation) {
        Route::get('/', 'index');
        Route::middleware($disableImpersonation)->group(function () {
            Route::put('/', 'updateDetails');
            Route::put('photo', 'updatePhoto');
            Route::put('photo/delete', 'deletePhoto');
        });
    });

    // Security
    Route::prefix('security')->group(function () use ($disableImpersonation) {
        Route::get('/', [SecurityController::class, 'index']);
        Route::put('password', [SecurityController::class, 'changePassword'])->middleware($disableImpersonation);
        Route::put('two-factor', [SecurityController::class, 'setupTwoFactor'])->middleware($disableImpersonation);
    });

    // Preferences
    Route::controller(PreferencesController::class)->group(function () use ($disableImpersonation) {
        Route::get('preferences', 'index');
        Route::middleware($disableImpersonation)->group(function () {
            Route::put('preferences', 'updatePreferences');
            Route::post('save-theme-preference', 'saveThemePreference');
        });
    });

    // Linked Accounts
    Route::prefix('linked-accounts')->controller(LinkedAccountsController::class)->group(function () use ($disableImpersonation) {
        Route::get('/', 'index');
        Route::get('{provider}/disconnect', 'disconnect')->middleware($disableImpersonation);
    });

    // Closing Account
    Route::controller(ClosingController::class)->group(function () use ($disableImpersonation) {
        Route::get('closing', 'showForm');
        Route::post('closing', 'postForm')->middleware($disableImpersonation);
    });

    // Subscription
    Route::controller(SubscriptionController::class)->group(function () {
        Route::pattern('id', '[0-9]+');
        Route::get('subscription', 'showForm');
        Route::post('subscription', 'postForm');
        Route::match(['get','post'],'{id}/payment/success', 'paymentConfirmation');
        Route::get('{id}/payment/cancel', 'paymentCancel');
    });

    // Transactions
    Route::prefix('transactions')->group(function () {
        Route::get('promotion', [TransactionsController::class, 'index']);
        Route::get('subscription', [TransactionsController::class, 'index']);
    });

    // Posts
    Route::prefix('posts')->controller(PostsController::class)->group(function () {
        Route::pattern('id', '[0-9]+');
        Route::get('list', 'onlinePosts');
        Route::get('list/{id}/offline', 'takePostOffline');
        Route::get('list/{id}/delete', 'destroy'); Route::post('list/delete', 'destroy');
        Route::get('archived', 'archivedPosts');
        Route::get('archived/{id}/repost', 'repostPost');
        Route::get('archived/{id}/delete', 'destroy'); Route::post('archived/delete', 'destroy');
        Route::get('pending-approval', 'pendingApprovalPosts');
        Route::get('pending-approval/{id}/delete', 'destroy'); Route::post('pending-approval/delete', 'destroy');
    });

    // Saved Posts
    Route::prefix('saved-posts')->controller(SavedPostsController::class)->group(function () {
        Route::pattern('id', '[0-9]+');
        Route::post('toggle', 'toggle');
        Route::get('/', 'index');
        Route::get('{id}/delete', 'destroy'); Route::post('delete', 'destroy');
    });

    // Saved Searches
    Route::prefix('saved-searches')->controller(SavedSearchesController::class)->group(function () {
        Route::pattern('id', '[0-9]+');
        Route::post('store', 'store');
        Route::get('/', 'index');
        Route::get('{id}', 'show');
        Route::get('{id}/delete', 'destroy'); Route::post('delete', 'destroy');
    });

    // Messages
    Route::prefix('messages')->controller(MessagesController::class)->group(function () {
        Route::pattern('id', '[0-9]+');
        Route::post('check-new', 'checkNew');
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('{id}', 'show');
        Route::put('{id}', 'update');
        Route::get('{id}/actions', 'actions'); Route::post('actions', 'actions');
        Route::get('{id}/delete', 'destroy'); Route::post('delete', 'destroy');
    });

});

// Contact Post's Author (public route)
Route::post('messages/posts/{id}', [MessagesController::class, 'store']);
