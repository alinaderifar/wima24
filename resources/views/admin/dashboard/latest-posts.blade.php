@php
    $authUser ??= null;
    $latestPosts ??= collect([]);
@endphp

@if (doesUserHavePermission($authUser, 'post-list') || userHasSuperAdminPermissions())
<div class="col-lg-6 col-md-12">
    <div class="card rounded-0 border-0 border-top border-primary shadow-sm">
        <div class="card-body">
            
            <div class="d-md-flex align-items-center mb-3">
                <h4 class="card-title fw-bold mb-0">
                    <span class="lstick d-inline-block align-middle"></span>
                    {{ __('admin.Latest Listings') }}
                </h4>
                <div class="ms-auto">
                    <a href="{{ urlGen()->addPost() }}" target="_blank" class="btn btn-sm btn-light rounded shadow" title="{{ __('admin.Post New Listing') }}">
                        {{ __('admin.Post New Listing') }}
                    </a>
                    <a href="{{ urlGen()->adminUrl('posts') }}" class="btn btn-sm btn-primary rounded shadow ms-1" title="{{ __('admin.View All Listings') }}">
                        {{ __('admin.View All Listings') }}
                    </a>
                </div>
            </div>
            
            <div class="table-responsive mt-md-3 mt-5">
                <table class="table v-middle mb-0">
                    <thead>
                        <tr>
                            <th class="text-nowrap">{{ __('admin.ID') }}</th>
                            <th class="text-nowrap">{{ mb_ucfirst(__('admin.title')) }}</th>
                            <th class="text-nowrap">{{ mb_ucfirst(__('admin.country')) }}</th>
                            <th class="text-nowrap">{{ __('admin.Status') }}</th>
                            <th class="text-nowrap">{{ __('admin.Date') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($latestPosts as $post)
                        <tr>
                            <td class="text-nowrap">{{ $post->id }}</td>
                            <td>{!! getPostUrl($post) !!}</td>
                            <td class="text-nowrap">{!! getCountryFlag($post) !!}</td>
                            <td class="text-nowrap">
                                @if (isVerifiedPost($post))
                                    <span class="badge bg-success fw-normal">{{ __('admin.Activated') }}</span>
                                @else
                                    <span class="badge bg-warning text-white fw-normal">{{ __('admin.Unactivated') }}</span>
                                @endif
                            </td>
                            <td class="text-nowrap">
                                {{ \App\Helpers\Common\Date::format($post->created_at, 'datetime') }}
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted">
                                {{ __('admin.No listings found') }}
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        
        </div>
    </div>
</div>
@endif

@push('dashboard_styles')
<style>
    .text-nowrap {
        white-space: nowrap;
    }
</style>
@endpush