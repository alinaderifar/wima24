<script>
	onDocumentReady((event) => {
		// Cache Driver
		const cacheDriverEl = document.querySelector("select[name=cache_driver].select2_from_array");
		if (cacheDriverEl) {
			updateCacheDriverFields(cacheDriverEl);
			$(cacheDriverEl).on("change", e => updateCacheDriverFields(e.target));
		}

		// Queue Driver
		const queueDriverEl = document.querySelector("select[name=queue_driver].select2_from_array");
		if (queueDriverEl) {
			updateQueueDriverFields(queueDriverEl);
			$(queueDriverEl).on("change", e => updateQueueDriverFields(e.target));
		}
	});

	/**
	 * Show/hide fields depending on selected cache driver
	 */
	function updateCacheDriverFields(driverEl) {
		const value = driverEl.value;

		// Default: show cache-enabled fields
		setElementsVisibility("show", ".cache-enabled");

		// Hide cache-enabled if "array" driver is selected
		if (value === "array") {
			setElementsVisibility("hide", ".cache-enabled");
		}

		// Show only memcached-specific fields if memcached driver is selected
		setElementsVisibility("hide", ".memcached");
		if (value === "memcached") {
			setElementsVisibility("show", ".memcached");
		}
	}

	/**
	 * Show/hide fields depending on selected queue driver
	 */
	function updateQueueDriverFields(driverEl) {
		const value = driverEl.value;

		// Hide all queue-specific fields first
		setElementsVisibility("hide", ".sqs");

		// Show SQS fields if "sqs" driver is selected
		if (value === "sqs") {
			setElementsVisibility("show", ".sqs");
		}
	}
</script>