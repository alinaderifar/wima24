<script>
	let smsDriversSelectors = {!! $smsDriversSelectorsJson !!};
	let smsDriversSelectorsList = Object.values(smsDriversSelectors);

	const smsToActivated = (smsToValue) => `{{ trans('admin.sms_to_activated') }}`;
	const smsToAdminActivated = `{{ trans('admin.sms_to_admin_activated') }}`;
	const smsToDisabled = `{{ trans('admin.sms_to_disabled') }}`;

	const alwaysToElSelector = "input[name=sms_to]";

	onDocumentReady(function(event) {
		// Driver select field
		let driverEl = document.querySelector("select[name=driver].select2_from_array");
		if (driverEl) {
			handleDriverFields(driverEl);
			$(driverEl).on("change", e => handleDriverFields(e.target));
		}

		// Driver test checkbox
		let driverTestEl = document.querySelector("input[type=checkbox][name=driver_test]");
		if (driverTestEl) {
			applyDriverTestChanges(driverTestEl, event.type);
			driverTestEl.addEventListener("change", e => applyDriverTestChanges(e.target, e.type));
		}

		// SMS To input blur triggers driver test update
		let smsToEl = document.querySelector(alwaysToElSelector);
		if (smsToEl) {
			smsToEl.addEventListener("blur", e => applyDriverTestChanges(driverTestEl, e.type));
		}

		// Phone as auth checkbox
		let phoneAsAuthFieldEl = document.querySelector("input[type=checkbox][name=enable_phone_as_auth_field]");
		enablePhoneNumberAsAuthField(phoneAsAuthFieldEl);
		if (phoneAsAuthFieldEl) {
			phoneAsAuthFieldEl.addEventListener("change", e => enablePhoneNumberAsAuthField(e.target));
		}
	});

	/**
	 * Shows/hides SMS driver specific fields based on selected driver.
	 */
	function handleDriverFields(driverEl) {
		const selectedDriverSelector = smsDriversSelectors[driverEl.value] ?? "";
		const toHide = smsDriversSelectorsList.filter(item => item !== selectedDriverSelector);

		setElementsVisibility("hide", toHide);
		setElementsVisibility("show", selectedDriverSelector);
	}

	/**
	 * Shows/hides the driver test fields and displays notifications.
	 */
	function applyDriverTestChanges(driverTestEl, eventType) {
		if (!driverTestEl) return;

		let smsToEl = document.querySelector(alwaysToElSelector);
		if (!smsToEl) return;

		let driverTestSelector = ".driver-test";

		if (driverTestEl.checked) {
			setElementsVisibility("show", driverTestSelector);

			if (eventType !== "DOMContentLoaded") {
				const smsToValue = smsToEl.value;
				if (smsToValue !== "") {
					pnAlert(smsToActivated(smsToValue), "info");
				} else {
					pnAlert(smsToAdminActivated, "info");
				}
			}
		} else {
			setElementsVisibility("hide", driverTestSelector);

			if (eventType !== "DOMContentLoaded") {
				pnAlert(smsToDisabled, "info");
			}
		}
	}

	/**
	 * Shows/hides the phone-as-auth related fields.
	 */
	function enablePhoneNumberAsAuthField(phoneAsAuthFieldEl) {
		if (!phoneAsAuthFieldEl) return;

		let action = phoneAsAuthFieldEl.checked ? "show" : "hide";
		setElementsVisibility(action, ".auth-field-el");
	}

	/**
	 * Sets the default authentication field (email or phone).
	 */
	function setDefaultAuthField(defaultValue = "email") {
		let defaultAuthFieldEl = document.querySelector("select[name=default_auth_field]");
		if (defaultAuthFieldEl) {
			defaultAuthFieldEl.value = defaultValue;
			$(defaultAuthFieldEl).trigger("change"); // for select2 consistency
		}
	}
</script>