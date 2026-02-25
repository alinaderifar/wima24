<script>
onDocumentReady(() => {
    // ====== ???????? ??????? ? ????? ======
    const socialNetworks = [
        "facebook",
        "linkedin",
        "twitter-oauth-1",
        "twitter-oauth-2",
        "google",
        "messenger"
    ];
    const globalSelector = "input[type=checkbox][data-social-network=all]";

    // ?????????? ??????? ???????
    socialNetworks.forEach(sn => {
        const el = document.querySelector(`input[type=checkbox][data-social-network=${sn}]`) 
                  || document.querySelector(`input[type=checkbox][name=${sn}]`);
        if (el) {
            applySocialNetworkActions(el);
            el.addEventListener("change", e => applySocialNetworkActions(e.target));
        }
    });

    // ?????????? ??????? ?????
    const globalEl = document.querySelector(globalSelector);
    if (globalEl) {
        applyGlobalActions(globalEl);
        globalEl.addEventListener("change", e => applyGlobalActions(e.target));
    }

    // ====== Header Fixed Top ======
    const headerFixedTopEl = document.querySelector("input[type=checkbox][name=header_fixed_top]");
    if (headerFixedTopEl) {
        toggleHeaderFixedTopFields(headerFixedTopEl);
        headerFixedTopEl.addEventListener("change", e => toggleHeaderFixedTopFields(e.target));
    }

    // ====== ????? ???????? ??????? ======
    function applySocialNetworkActions(el) {
        if (!el) return;
        const sn = el.dataset.socialNetwork || el.name;

        // ?????? ????? ??????
        if (sn === "twitter-oauth-2") toggleMutualExclusive("twitter-oauth-1", el.checked);
        if (sn === "twitter-oauth-1") toggleMutualExclusive("twitter-oauth-2", el.checked);

        // ?????/???? ???? ??????
        toggleFields(sn, el.checked);

        // ??????????? ??????? ?????
        updateGlobalCheckbox();
    }

    function applyGlobalActions(el) {
        if (!el || el.dataset.socialNetwork !== "all") return;
        socialNetworks.forEach(sn => {
            const snEl = document.querySelector(`input[type=checkbox][data-social-network=${sn}]`) 
                      || document.querySelector(`input[type=checkbox][name=${sn}]`);
            if (snEl) {
                snEl.checked = el.checked;
                snEl.dispatchEvent(new Event("change"));
            }
        });
    }

    function toggleMutualExclusive(sn, status) {
        const el = document.querySelector(`input[type=checkbox][data-social-network=${sn}]`);
        if (el && status && el.checked) {
            el.checked = false;
            el.dispatchEvent(new Event("change"));
        }
    }

    function toggleFields(sn, show) {
        if (!sn) return;
        setElementsVisibility(show ? "show" : "hide", `.${sn}`);
    }

    function updateGlobalCheckbox() {
        const globalEl = document.querySelector(globalSelector);
        if (!globalEl) return;
        const anyChecked = socialNetworks.some(sn => {
            const el = document.querySelector(`input[type=checkbox][data-social-network=${sn}]`) 
                      || document.querySelector(`input[type=checkbox][name=${sn}]`);
            return el && el.checked;
        });
        globalEl.checked = anyChecked;
    }

    // ====== ???? Header Fixed Top ======
    function toggleHeaderFixedTopFields(el) {
        if (!el) return;
        setElementsVisibility(el.checked ? "show" : "hide", ".fixed-header");
    }
});
</script>