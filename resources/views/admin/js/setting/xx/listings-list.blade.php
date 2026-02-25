<script>
	onDocumentReady(() => {
		// ?????? Display Mode
		const displayModeEl = document.querySelector("select[name=display_mode].select2_from_array");
		if (displayModeEl) {
			toggleDisplayModeFields(displayModeEl);
			$(displayModeEl).on("change", e => toggleDisplayModeFields(e.target));
		}

		// ?????? Left Sidebar
		const showLeftSidebarEl = document.querySelector("input[type=checkbox][name=show_left_sidebar]");
		if (showLeftSidebarEl) {
			toggleLeftSidebarFields(showLeftSidebarEl);
			showLeftSidebarEl.addEventListener("change", e => toggleLeftSidebarFields(e.target));
		}

		// ?????? Hide Date
		const hideDateEl = document.querySelector("input[type=checkbox][name=hide_date]");
		if (hideDateEl) {
			toggleDateFields(hideDateEl);
			hideDateEl.addEventListener("change", e => toggleDateFields(e.target));
		}

		// ?????? Extended Searches
		const extendedSearchesEl = document.querySelector("input[type=checkbox][name=cities_extended_searches]");
		if (extendedSearchesEl) {
			toggleExtendedSearchesFields(extendedSearchesEl);
			extendedSearchesEl.addEventListener("change", e => toggleExtendedSearchesFields(e.target));
		}
	});

	// === ????? ?????? ?????? ===
	const toggleDisplayModeFields = el => {
		setElementsVisibility("hide", ".grid-view");
		if (el.value === "grid-view") {
			setElementsVisibility("show", ".grid-view");
		}
	};

	const toggleLeftSidebarFields = el => {
		setElementsVisibility(el.checked ? "show" : "hide", ".show-search-sidebar");
	};

	const toggleDateFields = el => {
		setElementsVisibility(!el.checked ? "show" : "hide", ".date-field");
	};

	const toggleExtendedSearchesFields = el => {
		setElementsVisibility(el.checked ? "show" : "hide", ".extended-searches");
	};
</script>
