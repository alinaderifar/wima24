{{--
 * LaraClassifier - Classified Ads Web Application
 * Database Import Step
--}}
@extends('setup.install.layouts.master')
@section('title', trans('messages.database_import_title'))

@php
    $databaseName = $databaseInfo['database'] ?? null;

    // Step URLs & labels
    $previousStepUrl ??= null;
    $previousStepLabel ??= null;
    $formActionUrl ??= request()->fullUrl();
    $nextStepUrl ??= url('/');
    $nextStepLabel ??= trans('messages.next');
@endphp

@section('content')
<form name="databaseImportForm" action="{{ $formActionUrl }}" method="POST" novalidate>
    @csrf

    <div class="row" style="min-height: 160px;">
        <div class="mb-4 col-md-12">
            <h5 class="mb-0 fs-5 border-bottom pb-3">
                <i class="bi bi-database"></i> {{ trans('messages.database_import_title') }}
            </h5>
        </div>

        {{-- Overwrite Tables --}}
        @include('helpers.forms.fields.checkbox', [
            'label'     => trans('messages.database_overwrite_tables'),
            'name'      => 'overwrite_tables',
            'switch'    => true,
            'value'     => data_get($databaseInfo, 'overwrite_tables'),
            'hint'      => trans('messages.database_overwrite_tables_hint'),
            'baseClass' => ['wrapper' => 'mb-3 col-md-6'],
        ])

        {{-- Alert --}}
        <div class="mb-4 col-md-12 mt-4">
            <div class="alert alert-info">
                {!! trans('messages.database_import_hint', [
                    'btnLabel' => trans('messages.database_import_btn_label'),
                    'database' => $databaseName
                ]) !!}
            </div>
        </div>

        {{-- Buttons --}}
        <div class="col-md-12 text-end border-top pt-3 mt-3">
            @if (!empty($previousStepUrl))
                <a href="{{ $previousStepUrl }}" class="btn btn-secondary">
                    <i class="fa-solid fa-chevron-left"></i> {!! $previousStepLabel !!}
                </a>
            @endif
            <button type="submit" class="btn btn-primary">
                {!! $nextStepLabel !!} <i class="bi bi-gear"></i>
            </button>
        </div>
    </div>
</form>
@endsection

@section('after_scripts')
@parent
<script>
document.addEventListener('DOMContentLoaded', function() {
    const overwriteCheckbox = document.querySelector('input[type=checkbox][name="overwrite_tables"]');
    if (!overwriteCheckbox) return;

    const parentWrapper = overwriteCheckbox.closest('div.form-check');
    if (!parentWrapper) return;

    // ???? ??? ?? ??? ???? toggle ??????
    parentWrapper.addEventListener('click', function(e) {
        // ??????? ?? ?? ??? toggle ??? input ?? label
        if (['input', 'label'].includes(e.target.tagName.toLowerCase())) return;

        overwriteCheckbox.checked = !overwriteCheckbox.checked;
        overwriteCheckbox.dispatchEvent(new Event('change'));
    });
});
</script>
@endsection