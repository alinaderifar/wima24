<script>
	onDocumentReady(() => {
		const backupEl = document.querySelector("select[name=taking_backup].select2_from_array");
		if (!backupEl) return;

		// ???? ?? ?????
		toggleBackupFields(backupEl);

		// ????? ?????
		backupEl.addEventListener("change", e => toggleBackupFields(e.target));
	});

	function toggleBackupFields(selectEl) {
		const action = selectEl.value !== "none" ? "show" : "hide";
		setElementsVisibility(action, ".taking-backup-field");
	}
</script>