<script>
	const honeypotElSelector = "input[type=checkbox][name=honeypot_enabled]";
	const validFromTimestampElSelector = "input[type=checkbox][name=honeypot_valid_from_timestamp]";
	const captchaElSelector = "select[name=captcha].select2_from_array";
	const recaptchaVersionElSelector = "select[name=recaptcha_version].select2_from_array";

	onDocumentReady((event) => {
		/* Honeypot */
		const honeypotEl = document.querySelector(honeypotElSelector);
		if (honeypotEl) {
			toggleHoneypotFields(honeypotEl);
			honeypotEl.addEventListener("change", e => toggleHoneypotFields(e.target));
		}

		const validFromTimestampEl = document.querySelector(validFromTimestampElSelector);
		if (validFromTimestampEl) {
			toggleHoneypotTimestampFields(validFromTimestampEl);
			validFromTimestampEl.addEventListener("change", e => toggleHoneypotTimestampFields(e.target));
		}

		/* Captcha */
		const captchaEl = document.querySelector(captchaElSelector);
		if (captchaEl) {
			toggleCaptchaFields(captchaEl);
			$(captchaEl).on("change", e => toggleCaptchaFields(e.target));
		}

		/* ReCaptcha version */
		const recaptchaVersionEl = document.querySelector(recaptchaVersionElSelector);
		if (recaptchaVersionEl) {
			toggleReCaptchaFields(recaptchaVersionEl);
			$(recaptchaVersionEl).on("change", e => toggleReCaptchaFields(e.target));
		}
	});

	/**
	 * Honeypot main toggle
	 */
	function toggleHoneypotFields(honeypotEl) {
		if (!honeypotEl) return;
		const action = honeypotEl.checked ? "show" : "hide";
		setElementsVisibility(action, ".honeypot-el");

		const validFromTimestampEl = document.querySelector(validFromTimestampElSelector);
		toggleHoneypotTimestampFields(validFromTimestampEl);
	}

	/**
	 * Honeypot "valid from timestamp" toggle
	 */
	function toggleHoneypotTimestampFields(validFromTimestampEl) {
		if (!validFromTimestampEl) return;

		const honeypotEl = document.querySelector(honeypotElSelector);
		if (!honeypotEl) return;

		const action = honeypotEl.checked && validFromTimestampEl.checked ? "show" : "hide";
		setElementsVisibility(action, ".honeypot-timestamp-el");
	}

	/**
	 * Captcha fields toggle
	 */
	function toggleCaptchaFields(captchaEl) {
		if (!captchaEl) return;

		const captchaValue = captchaEl.value;

		if (captchaValue === "") {
			setElementsVisibility("hide", [".s-captcha", ".recaptcha"]);
		} else if (["default", "math", "flat", "mini", "inverse"].includes(captchaValue)) {
			setElementsVisibility("hide", [".recaptcha", ".s-captcha-custom"]);
			setElementsVisibility("show", ".s-captcha:not(.s-captcha-custom)");
		} else if (captchaValue === "custom") {
			setElementsVisibility("hide", ".recaptcha");
			setElementsVisibility("show", ".s-captcha");
		} else if (captchaValue === "recaptcha") {
			setElementsVisibility("hide", ".s-captcha");
			setElementsVisibility("show", ".recaptcha");

			const recaptchaVersionEl = document.querySelector(recaptchaVersionElSelector);
			toggleReCaptchaFields(recaptchaVersionEl);
		}
	}

	/**
	 * ReCaptcha version toggle
	 */
	function toggleReCaptchaFields(recaptchaVersionEl) {
		if (!recaptchaVersionEl) return;

		const recaptchaValue = recaptchaVersionEl.value;
		const captchaEl = document.querySelector(captchaElSelector);

		if (captchaEl && captchaEl.value === "recaptcha") {
			setElementsVisibility("hide", ".s-captcha");
			setElementsVisibility("show", ".recaptcha");

			if (recaptchaValue === "v3") {
				setElementsVisibility("hide", ".recaptcha-v2");
				setElementsVisibility("show", ".recaptcha-v3");
			} else {
				setElementsVisibility("hide", ".recaptcha-v3");
				setElementsVisibility("show", ".recaptcha-v2");
			}
		} else {
			setElementsVisibility("hide", ".recaptcha");
		}
	}
</script>