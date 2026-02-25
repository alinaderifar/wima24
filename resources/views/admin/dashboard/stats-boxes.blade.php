<div class="row">

    @php
        $stats = [
            'unactivatedPosts' => [
                'count' => $countUnactivatedPosts ?? null,
                'url' => urlGen()->adminUrl('posts?active=2'),
                'title' => __('admin.Unactivated listings'),
                'icon' => 'fa-regular fa-pen-to-square',
                'bg' => 'bg-orange',
            ],
            'activatedPosts' => [
                'count' => $countActivatedPosts ?? null,
                'url' => urlGen()->adminUrl('posts?active=1'),
                'title' => __('admin.Activated listings'),
                'icon' => 'fa-regular fa-circle-check',
                'bg' => 'text-bg-success',
            ],
            'users' => [
                'count' => $countUsers ?? null,
                'url' => urlGen()->adminUrl('users'),
                'title' => mb_ucfirst(__('admin.users')),
                'icon' => 'fa-regular fa-circle-user',
                'bg' => 'text-bg-info',
            ],
            'countries' => [
                'count' => $countCountries ?? null,
                'url' => urlGen()->adminUrl('countries'),
                'title' => __('admin.Activated countries'),
                'icon' => 'fa-solid fa-globe',
                'bg' => 'text-bg-dark text-white',
                'help' => __('admin.launch_your_website_for_several_countries') . ' ' . __('admin.disabling_or_removing_a_country_info'),
            ],
        ];
    @endphp

    @foreach ($stats as $stat)
        @if (!is_null($stat['count']))
            <div class="col-lg-3 col-6">
                <div class="card border-0 shadow {{ $stat['bg'] }}">
                    <div class="card-body">
                        <div class="row py-1">
                            <div class="col-8 d-flex align-items-center">
                                <div>
                                    <h2 class="fw-light">
                                        <a href="{{ $stat['url'] }}" class="text-white fw-bold">
                                            {{ $stat['count'] }}
                                        </a>
                                    </h2>
                                    <h6 class="text-white">
                                        <a href="{{ $stat['url'] }}" class="text-white">
                                            {{ $stat['title'] }}
                                        </a>
                                        @if (!empty($stat['help']))
                                            <span class="badge bg-body-secondary text-dark"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="bottom"
                                                  title="{{ $stat['help'] }}">
                                                {{ __('admin.Help') }} <i class="fa-regular fa-life-ring"></i>
                                            </span>
                                        @endif
                                    </h6>
                                </div>
                            </div>
                            <div class="col-4 d-flex align-items-center justify-content-end">
                                <span class="text-white display-6">
                                    <a href="{{ $stat['url'] }}" class="text-white">
                                        <i class="{{ $stat['icon'] }}"></i>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endif
    @endforeach

</div>

@push('dashboard_styles')
@endpush

@push('dashboard_scripts')
@endpush