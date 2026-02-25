@php
    $latestPostsChart ??= [];
    $postsChartDataJson = data_get($latestPostsChart, 'data', '[]');
@endphp

<div class="col-lg-6 col-md-12">
    <div class="card border-0 shadow-sm">
        <div class="card-body">
            <div class="d-flex align-items-center mb-3">
                <h4 class="card-title fw-bold mb-0">
                    <span class="lstick d-inline-block align-middle"></span>
                    {{ data_get($latestPostsChart, 'title', __('admin.No data found')) }}
                </h4>
                <div class="ms-auto">
                    <ul class="list-inline mb-0 text-end">
                        <li class="list-inline-item">
                            <h5><i class="fa-solid fa-circle text-primary"></i> {{ __('admin.Activated') }}</h5>
                        </li>
                        <li class="list-inline-item">
                            <h5><i class="fa-solid fa-circle text-body-tertiary"></i> {{ __('admin.Unactivated') }}</h5>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="lineChartPosts" class="position-relative" style="height:300px;"></div>
        </div>
    </div>
</div>

@push('dashboard_styles')
    <style>
        #lineChartPosts svg {
            width: 100% !important;
        }
    </style>
@endpush

@push('dashboard_scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    try {
        var chartData = {!! $postsChartDataJson !!};

        if (chartData && chartData.length > 0) {
            var lineChartPosts = new Morris.Line({
                element: 'lineChartPosts',
                data: chartData,
                xkey: 'y',
                ykeys: ['activated', 'unactivated'],
                labels: ['{{ __('admin.Activated') }}', '{{ __('admin.Unactivated') }}'],
                lineColors: ['#398bf7', '#dddddd'],
                gridLineColor: '#e0e0e0',
                resize: true,
                hideHover: 'auto',
                parseTime: false
            });

            let alreadyRedrawn = false;
            let haveToResizeCharts = false;

            window.addEventListener('resize', function () {
                haveToResizeCharts = true;
            });

            setInterval(function () {
                if (lineChartPosts) {
                    if (!alreadyRedrawn) {
                        lineChartPosts.redraw();
                        alreadyRedrawn = true;
                    }
                    if (haveToResizeCharts) {
                        lineChartPosts.redraw();
                        haveToResizeCharts = false;
                    }
                }
            }, 200);
        } else {
            document.getElementById('lineChartPosts').innerHTML = '<div class="text-muted">{{ __("admin.No data found") }}</div>';
        }
    } catch (error) {
        console.error('Error rendering lineChartPosts:', error);
        document.getElementById('lineChartPosts').innerHTML = '<div class="text-danger">{{ __("admin.Error loading chart") }}</div>';
    }
});
</script>
@endpush