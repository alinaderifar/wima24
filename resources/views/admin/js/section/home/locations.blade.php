<script>
	onDocumentReady(() => {
		// ?????? ????????? ???????
		const toggleFields = [
			{ selector: "input[name=show_cities]", targetClass: ".cities-field" },
			{ selector: "input[name=enable_map]", targetClass: ".map-field" }
		];

		toggleFields.forEach(item => {
			const el = document.querySelector(item.selector);
			if (!el) return;

			// Initialize on load
			toggleVisibility(el, item.targetClass);

			// Listen for changes
			el.addEventListener("change", e => toggleVisibility(e.target, item.targetClass));
		});
	});

	function toggleVisibility(checkboxEl, targetClass) {
		const action = checkboxEl.checked ? "show" : "hide";
		setElementsVisibility(action, targetClass);
	}
</script>