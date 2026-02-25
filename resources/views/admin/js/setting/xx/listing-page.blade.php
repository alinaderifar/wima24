<script>
	const enableWhatsappBtnElSelector = "input[type=checkbox][name=enable_whatsapp_btn]";
	const hidePhoneNumberElSelector = "select[name=hide_phone_number].select2_from_array";

	const activatingWhatsappBtn = `{{ trans('admin.activating_whatsapp_btn') }}`;
	const activatingHidePhoneNumber = `{{ trans('admin.activating_hide_phone_number') }}`;

	onDocumentReady(() => {
		// ?????? Security Tips
		const showSecurityTipsEl = document.querySelector("input[type=checkbox][name=show_security_tips]");
		if (showSecurityTipsEl) {
			toggleSecurityTipsFields(showSecurityTipsEl);
			showSecurityTipsEl.addEventListener("change", e => toggleSecurityTipsFields(e.target));
		}

		// ?????? WhatsApp Button
		const enableWhatsappBtnEl = document.querySelector(enableWhatsappBtnElSelector);
		if (enableWhatsappBtnEl) {
			toggleWhatsappBtnFields(enableWhatsappBtnEl);
			enableWhatsappBtnEl.addEventListener("change", e => toggleWhatsappBtnFields(e.target));
		}

		// ?????? Hide Phone Number
		const hidePhoneNumberEl = document.querySelector(hidePhoneNumberElSelector);
		if (hidePhoneNumberEl) {
			checkHidePhoneNumber(hidePhoneNumberEl);
			$(hidePhoneNumberEl).on("change", e => checkHidePhoneNumber(e.target));
		}

		// ?????? Hide Date
		const hideDateEl = document.querySelector("input[type=checkbox][name=hide_date]");
		if (hideDateEl) {
			toggleDateFields(hideDateEl);
			hideDateEl.addEventListener("change", e => toggleDateFields(e.target));
		}

		// ?????? Similar Listings
		const similarListingsEl = document.querySelector("select[name=similar_listings].select2_from_array");
		if (similarListingsEl) {
			toggleSimilarListingsFields(similarListingsEl);
			$(similarListingsEl).on("change", e => toggleSimilarListingsFields(e.target));
		}
	});

	// === ????? ?????? ?????? ===
	const toggleSecurityTipsFields = el => {
		setElementsVisibility(el.checked ? "hide" : "show", ".security-tips-field");
	};

	const toggleWhatsappBtnFields = el => {
		setElementsVisibility(el.checked ? "show" : "hide", ".whatsapp-btn-field");
		unsetHidePhoneNumber(el);
	};

	const checkHidePhoneNumber = el => {
		const whatsappEl = document.querySelector(enableWhatsappBtnElSelector);
		if (!whatsappEl) return;

		if (el.value !== "0" && whatsappEl.checked) {
			whatsappEl.checked = false;
			pnAlert(activatingHidePhoneNumber, "notice");
		}
	};

	const unsetHidePhoneNumber = el => {
		const hideEl = document.querySelector(hidePhoneNumberElSelector);
		if (!hideEl || !el.checked) return;

		if (hideEl.value !== "0") {
			hideEl.value = "0";
			hideEl.dispatchEvent(new Event("change")); // trigger select2 change
			pnAlert(activatingWhatsappBtn, "info");
		}
	};

	const toggleDateFields = el => {
		setElementsVisibility(el.checked ? "hide" : "show", ".date-field");
	};

	const toggleSimilarListingsFields = el => {
		setElementsVisibility("hide", ".similar-listings-field");
		if (el.value !== "0" && el.value !== 0) {
			setElementsVisibility("show", ".similar-listings-field");
		}
	};
</script>