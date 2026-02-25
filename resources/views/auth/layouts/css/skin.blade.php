@if (!empty($primaryBgColor))
@php
    // Default fallback for hover color
    $primaryBgColor10 ??= $primaryBgColor;

    // Convert hex to RGB strings
    $primaryBgColorRgb   = rgbToCss(hexToRgb($primaryBgColor), true);
    $primaryBgColor10Rgb = rgbToCss(hexToRgb($primaryBgColor10), true);
@endphp

<style>
/* === Skin === */
:root,
[data-bs-theme="light"] {
    --bs-themecolor: {{ $primaryBgColor }};
    --bs-themecolor-rgb: {{ $primaryBgColorRgb }};
    --bs-themehovercolor: {{ $primaryBgColor10 }};
    --bs-themehovercolor-rgb: {{ $primaryBgColor10Rgb }};

    --bs-link-color: var(--bs-themecolor);
    --bs-link-color-rgb: var(--bs-themecolor-rgb);
    --bs-link-hover-color: var(--bs-themehovercolor);
    --bs-link-hover-color-rgb: var(--bs-themehovercolor-rgb);

    --bs-primary: var(--bs-themecolor);
    --bs-primary-rgb: var(--bs-themecolor-rgb);
    --bs-primary-text-emphasis: {{ $primaryDarkBgColor ?? '#000' }};
    --bs-primary-bg-subtle: {{ $primaryBgColor50 ?? 'rgba(0,0,0,0.05)' }};
    --bs-primary-border-subtle: {{ $primaryBgColor20d ?? 'rgba(0,0,0,0.2)' }};

    --bs-body-color: #4c4d4d;
    --bs-body-color-rgb: 76, 77, 77;
    --bs-heading-color: var(--bs-emphasis-color);
    --bs-body-font-family: Poppins, sans-serif;
}

[data-bs-theme="dark"] {
    color-scheme: dark;

    --bs-link-color: var(--bs-themecolor);
    --bs-link-color-rgb: var(--bs-themecolor-rgb);
    --bs-link-hover-color: var(--bs-themehovercolor);
    --bs-link-hover-color-rgb: var(--bs-themehovercolor-rgb);

    --bs-heading-color: var(--bs-emphasis-color);
    --bs-body-color: #dee2e6;
    --bs-body-color-rgb: 222, 226, 230;
}

/* Disabled buttons */
.btn.disabled,
.btn:disabled,
fieldset:disabled .btn {
    background-color: var(--bs-themecolor);
    border-color: var(--bs-themehovercolor);
    color: var(--bs-btn-disabled-color);
}
</style>
@endif