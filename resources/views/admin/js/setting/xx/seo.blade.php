<script>
	const permalinksJson = {!! $permalinksJson !!};
	const defaultPermalink = "{{ config('settings.seo.listing_permalink') }}";

	onDocumentReady((event) => {
		const listingHashedIdEnabledEl = document.querySelector("input[type=checkbox][name=listing_hashed_id_enabled]");
		if (listingHashedIdEnabledEl) {
			toggleListingPermalinks(listingHashedIdEnabledEl);
			listingHashedIdEnabledEl.addEventListener("change", e => toggleListingPermalinks(e.target));
		}
	});

	/**
	 * Updates the select options for listing permalinks depending on whether
	 * hashed IDs are enabled or not.
	 */
	function toggleListingPermalinks(listingHashedIdEnabledEl) {
		if (!listingHashedIdEnabledEl) return;

		const listingPermalinkEl = document.querySelector("select[name=listing_permalink].select2_from_array");
		if (!listingPermalinkEl) return;

		const updatedPermalinks = generatePermalinks(permalinksJson, listingHashedIdEnabledEl.checked);
		updateSelect2Options(listingPermalinkEl, updatedPermalinks, defaultPermalink);
	}

	/**
	 * Generates a new permalinks object based on the hashed ID status.
	 * Replaces {id} with {hashableId} if hashable is enabled, and vice versa.
	 */
	function generatePermalinks(jsonObject, isHashable = true) {
		const hashablePattern = /{hashableId}/g;
		const idPattern = /{id}/g;

		const newPermalinks = {};
		for (let key in jsonObject) {
			if (!jsonObject.hasOwnProperty(key)) continue;

			let value = jsonObject[key];
			if (isHashable) {
				value = value.replace(idPattern, '{hashableId}');
			} else {
				value = value.replace(hashablePattern, '{id}');
			}
			newPermalinks[key] = value;
		}
		return newPermalinks;
	}
</script>