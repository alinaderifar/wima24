<script>
	onDocumentReady((event) => {
		const catDisplayTypeEl = document.querySelector("select[name=cat_display_type].select2_from_array");
		if (!catDisplayTypeEl) return;

		// Initialize on load
		handleCatDisplayTypeChange(catDisplayTypeEl);

		// Listen to changes
		catDisplayTypeEl.addEventListener("change", e => handleCatDisplayTypeChange(e.target));
	});

	function handleCatDisplayTypeChange(selectEl) {
		const value = selectEl.value;

		// Hide all first
		setElementsVisibility("hide", ".normal-type, .nested-type");

		// Show normal type for these values
		const normalTypes = ["c_normal_list", "c_border_list", "c_bigIcon_list", "c_picture_list"];
		if (normalTypes.includes(value)) {
			setElementsVisibility("show", ".normal-type");
		}

		// Show nested type for these values
		const nestedTypes = ["cc_normal_list", "cc_normal_list_s"];
		if (nestedTypes.includes(value)) {
			setElementsVisibility("show", ".nested-type");
		}
	}
</script>