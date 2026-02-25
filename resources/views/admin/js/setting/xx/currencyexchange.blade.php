<script>
	const currencyexchangeDriversSelectors = {!! $currencyexchangeDriversSelectorsJson !!};
	const currencyexchangeDriversSelectorsList = Object.values(currencyexchangeDriversSelectors);

	onDocumentReady(() => {
		const activationEl = document.querySelector("input[type=checkbox][name=activation]");
		const driverEl = document.querySelector("select[name=driver].select2_from_array");

		if (activationEl) {
			toggleExchangeFields(activationEl);
			activationEl.addEventListener("change", e => toggleExchangeFields(e.target));
		}

		if (driverEl) {
			toggleDriverFields(driverEl);
			driverEl.addEventListener("change", e => toggleDriverFields(e.target));
		}
	});

	function toggleExchangeFields(checkboxEl) {
		const action = checkboxEl.checked ? "show" : "hide";
		setElementsVisibility(action, ".ex-enabled");

		// ??? ???? ??? ????? ?? ?? ??????? ?????? ????? ???? ????
		if (checkboxEl.checked) {
			const driverEl = document.querySelector("select[name=driver].select2_from_array");
			if (driverEl) toggleDriverFields(driverEl);
		}
	}

	function toggleDriverFields(selectEl) {
		const selectedDriverSelector = currencyexchangeDriversSelectors[selectEl.value] ?? "";
		const toHide = currencyexchangeDriversSelectorsList.filter(sel => sel !== selectedDriverSelector);

		setElementsVisibility("hide", toHide);
		if (selectedDriverSelector) setElementsVisibility("show", selectedDriverSelector);
	}
</script>