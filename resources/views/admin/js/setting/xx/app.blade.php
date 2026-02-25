<script>
	// ?????? PHP
	const phpDateFormat = "{{ $phpDateFormat }}";
	const phpDatetimeFormat = "{{ $phpDatetimeFormat }}";
	const phpDateFormatHint = "{!! escapeStringForJs($phpDateFormatHint) !!}";

	const isoDateFormat = "{{ $isoDateFormat }}";
	const isoDatetimeFormat = "{{ $isoDatetimeFormat }}";
	const isoDateFormatHint = "{!! escapeStringForJs($isoDateFormatHint) !!}";

	onDocumentReady(() => {
		// ???????? ???? ?????? ?????????? ? ????/?????? ??????
		const toggles = [
			{ selector: "input[name=dark_theme_enabled]", targetClass: ".dark-mode-field" },
			{ selector: "input[name=show_countries_charts]", targetClass: ".countries-charts-field" },
			{ selector: "input[name=php_specific_date_format]", action: applyDateFormat }
		];

		toggles.forEach(item => {
			const el = document.querySelector(item.selector);
			if (!el) return;

			// ????? ?????
			if (item.targetClass) toggleVisibility(el, item.targetClass);
			if (item.action) item.action(el);

			// ?????? ?????
			el.addEventListener("change", e => {
				if (item.targetClass) toggleVisibility(e.target, item.targetClass);
				if (item.action) item.action(e.target);
			});
		});
	});

	// ???? ????? ???? ?????/???? ???? ????????
	function toggleVisibility(checkboxEl, targetClass) {
		const action = checkboxEl.checked ? "show" : "hide";
		setElementsVisibility(action, targetClass);
	}

	// ???? ??????? ???? ????? ???? ?????
	function applyDateFormat(checkboxEl) {
		const isPhp = checkboxEl.checked;
		const dateFormat = isPhp ? phpDateFormat : isoDateFormat;
		const datetimeFormat = isPhp ? phpDatetimeFormat : isoDatetimeFormat;
		const dateFormatHint = isPhp ? phpDateFormatHint : isoDateFormatHint;

		["date_format", "datetime_format"].forEach(name => {
			const inputEl = document.querySelector(`input[name=${name}]`);
			if (!inputEl) return;

			inputEl.value = name === "date_format" ? dateFormat : datetimeFormat;

			const hintEl = inputEl.nextElementSibling;
			if (hintEl) {
				hintEl.innerHTML = dateFormatHint;
				initElementPopovers(hintEl, { html: true });
			}
		});
	}
</script>
