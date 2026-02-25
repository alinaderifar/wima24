<script>
	const geoipDriversSelectors = {!! $geoipDriversSelectorsJson !!};
	const geoipDriversSelectorsList = Object.values(geoipDriversSelectors);

	const geoipActivationElSelector = "input[type=checkbox][name=geoip_activation]";
	const defaultCountryElSelector = "select[name=default_country_code].select2_field";

	const activatingGeolocation = `{{ trans('admin.activating_geolocation') }}`;
	const disablingGeolocation = `{{ trans('admin.disabling_geolocation') }}`;
	const specifyingDefaultCountry = `{{ trans('admin.specifying_default_country') }}`;
	const removingDefaultCountry = `{{ trans('admin.removing_default_country') }}`;

	onDocumentReady(() => {
		// ?????? ??????? Driver
		const driverEl = document.querySelector("select[name=geoip_driver].select2_from_array");
		if (driverEl) {
			toggleDriverFields(driverEl);
			$(driverEl).on("change", e => toggleDriverFields(e.target));
		}

		// ?????? ????????? GeoIP
		const geoipActivationEl = document.querySelector(geoipActivationElSelector);
		if (geoipActivationEl) {
			geoipActivationEl.addEventListener("change", e => handleGeoipActivationChange(e.target));
		}

		// ?????? ????? Default Country
		const defaultCountryEl = document.querySelector(defaultCountryElSelector);
		if (defaultCountryEl) {
			$(defaultCountryEl).on("change", e => handleDefaultCountryChange(e.target));
		}
	});

	// === ????? ?????? ?????? ===
	function toggleDriverFields(driverEl) {
		const selectedSelector = geoipDriversSelectors[driverEl.value] || "";
		const selectorsToHide = geoipDriversSelectorsList.filter(item => item !== selectedSelector);

		setElementsVisibility("hide", selectorsToHide);
		setElementsVisibility("show", selectedSelector);
	}

	function handleGeoipActivationChange(geoipActivationEl) {
		const defaultCountryEl = document.querySelector(defaultCountryElSelector);
		if (!defaultCountryEl) return;

		if (geoipActivationEl.checked) {
			// ??????? ???? Default Country
			defaultCountryEl.value = "";
			defaultCountryEl.dispatchEvent(new Event("change"));
			pnAlert(activatingGeolocation, "info");
		} else {
			// ????? ??? ???? Default Country
			defaultCountryEl.focus();
			pnAlert(disablingGeolocation, "notice");
		}
	}

	function handleDefaultCountryChange(defaultCountryEl) {
		const geoipActivationEl = document.querySelector(geoipActivationElSelector);
		if (!geoipActivationEl) return;

		// ??? Default Country ???? ?? ? GeoIP ???? ??? ? GeoIP ??? ????
		if (geoipActivationEl.checked && defaultCountryEl.value !== "") {
			geoipActivationEl.checked = false;
			pnAlert(specifyingDefaultCountry, "info");
		}

		// ??? GeoIP ??????? ? Default Country ???? ??? ? GeoIP ???? ???
		if (!geoipActivationEl.checked && defaultCountryEl.value === "") {
			geoipActivationEl.checked = true;
			pnAlert(removingDefaultCountry, "notice");
		}
	}
</script>