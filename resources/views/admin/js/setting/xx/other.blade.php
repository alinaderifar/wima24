<script>
	let gmapsIntegrationTypesSelectors = {!! $gmapsIntegrationTypesSelectorsJson !!};
	let gmapsIntegrationTypesSelectorsList = Object.values(gmapsIntegrationTypesSelectors);

	onDocumentReady((event) => {
		const gmapsIntegrationEl = document.querySelector("select[name=google_maps_integration_type].select2_from_array");
		if (gmapsIntegrationEl) {
			updateGmapsIntegrationFields(gmapsIntegrationEl);
			$(gmapsIntegrationEl).on("change", e => updateGmapsIntegrationFields(e.target));
		}
	});

	/**
	 * Show/hide Google Maps integration fields based on the selected type
	 */
	function updateGmapsIntegrationFields(gmapsIntegrationEl) {
		const selectedSelector = gmapsIntegrationTypesSelectors[gmapsIntegrationEl.value] ?? "";
		const selectorsToHide = gmapsIntegrationTypesSelectorsList.filter(item => item !== selectedSelector);

		setElementsVisibility("hide", selectorsToHide);
		setElementsVisibility("show", selectedSelector);
	}
</script>