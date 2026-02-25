@if (config('settings.app.show_countries_charts'))
    @php
        $usersPerCountry ??= [];

        $countUsersCountries = (int) data_get($usersPerCountry, 'countCountries', 0);

        $usersDataJson = data_get($usersPerCountry, 'data', '{}');
        $usersDataArr = json_decode($usersDataJson, true) ?: [];
        $usersDataArrLabels = data_get($usersDataArr, 'labels', []);
        $countUsersLabels = (is_array($usersDataArrLabels) && count($usersDataArrLabels) > 1) ? count($usersDataArrLabels) : 0;

        // Show legend if labels are 15 or less
        $usersDisplayLegend = $countUsersLabels <= 15;
    @endphp

    @if ($countUsersCountries > 1)
        <div class="col-lg-6 col-md-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <h4 class="card-title mb-0 fw-bold">
                            <span class="lstick d-inline-block align-middle"></span>
                            {{ data_get($usersPerCountry, 'title', __('admin.No data found')) }}
                        </h4>
                    </div>
                    <div class="position-relative chart-responsive">
                        @if ($countUsersLabels > 0)
                            <canvas id="pieChartUsers"></canvas>
                        @else
                            <div class="text-muted">{{ __('admin.No data found') }}</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    @endif

    @push('dashboard_styles')
        <style>
            canvas {
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
        </style>
    @endpush

    @push('dashboard_scripts')
        @if ($countUsersCountries > 1 && $countUsersLabels > 0)
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    var ctx = document.getElementById('pieChartUsers')?.getContext('2d');
                    if (!ctx) return;

                    var configUsersChart = {
                        type: 'pie',
                        data: {!! $usersDataJson !!},
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: {{ $usersDisplayLegend ? 'true' : 'false' }},
                                    position: 'right'
                                },
                                title: {
                                    display: false
                                }
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            }
                        }
                    };

                    window.myUsersDoughnut = new Chart(ctx, configUsersChart);
                });
            </script>
        @endif
    @endpush
@endif