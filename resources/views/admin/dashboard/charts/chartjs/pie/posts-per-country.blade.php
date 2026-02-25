@if (config('settings.app.show_countries_charts'))
    @php
        $postsPerCountry ??= [];

        $countPostsCountries = (int) data_get($postsPerCountry, 'countCountries', 0);

        $postsDataJson = data_get($postsPerCountry, 'data', '{}');
        $postsDataArr = json_decode($postsDataJson, true) ?: [];
        $postsDataArrLabels = data_get($postsDataArr, 'labels', []);
        $countPostsLabels = (is_array($postsDataArrLabels) && count($postsDataArrLabels) > 1) ? count($postsDataArrLabels) : 0;

        // Show legend if labels are 15 or less
        $postsDisplayLegend = $countPostsLabels <= 15;
    @endphp

    @if ($countPostsCountries > 1)
        <div class="col-lg-6 col-md-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <h4 class="card-title mb-0 fw-bold">
                            <span class="lstick d-inline-block align-middle"></span>
                            {{ data_get($postsPerCountry, 'title', __('admin.No data found')) }}
                        </h4>
                    </div>
                    <div class="position-relative chart-responsive">
                        @if ($countPostsLabels > 0)
                            <canvas id="pieChartPosts"></canvas>
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
        @if ($countPostsCountries > 1 && $countPostsLabels > 0)
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    var ctx = document.getElementById('pieChartPosts')?.getContext('2d');
                    if (!ctx) return;

                    var configPostsChart = {
                        type: 'pie',
                        data: {!! $postsDataJson !!},
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: {{ $postsDisplayLegend ? 'true' : 'false' }},
                                    position: 'left'
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

                    window.myPostsDoughnut = new Chart(ctx, configPostsChart);
                });
            </script>
        @endif
    @endpush
@endif