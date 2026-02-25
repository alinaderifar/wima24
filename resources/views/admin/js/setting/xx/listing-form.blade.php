<script>
	const formTypesSelectors = {!! $formTypesSelectorsJson !!};
	const formTypesSelectorsList = Object.values(formTypesSelectors);

	onDocumentReady(() => {
		// ?????? ??????? ???
		const formTypeEl = document.querySelector("select[name=publication_form_type].select2_from_array");
		if (formTypeEl) {
			updateFormTypeFields(formTypeEl);
			$(formTypeEl).on("change", e => updateFormTypeFields(e.target));
		}

		// ?????? ??????? utf8mb4
		const utf8mb4EnabledEl = document.querySelector("input[type=checkbox][name=utf8mb4_enabled]");
		if (utf8mb4EnabledEl) {
			toggleUtf8mb4Fields(utf8mb4EnabledEl);
			utf8mb4EnabledEl.addEventListener("change", e => toggleUtf8mb4Fields(e.target));
		}
	});

	function updateFormTypeFields(selectEl) {
		const selectedSelector = formTypesSelectors[selectEl.value] ?? "";
		const toHide = formTypesSelectorsList.filter(item => item !== selectedSelector);

		setElementsVisibility("hide", toHide);
		setElementsVisibility("show", selectedSelector);
	}

	function toggleUtf8mb4Fields(checkboxEl) {
		const action = checkboxEl.checked ? "show" : "hide";
		setElementsVisibility(action, ".utf8mb4-field");
	}
</script>