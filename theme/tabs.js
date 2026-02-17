/**
 * Change active tab of tabs.
 *
 * @param {Element} container
 * @param {string} name
 */
const changeTab = (container, name) => {
    for (const child of container.children) {
        if (!(child instanceof HTMLElement)) {
            continue;
        }

        if (child.classList.contains('mdbook-tabs')) {
            for (const tab of child.children) {
                if (!(tab instanceof HTMLElement)) {
                    continue;
                }

                if (tab.dataset.tabname === name) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            }
        } else if (child.classList.contains('mdbook-tab-content')) {
            if (child.dataset.tabname === name) {
                child.classList.remove('hidden');
            } else {
                child.classList.add('hidden');
            }
        }
    }
};

/**
 * Update URL query params to reflect current tab selections.
 * Only includes params for tab globals present on the page.
 */
const updateTabUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const seen = new Set();

    document
        .querySelectorAll('.mdbook-tabs-container[data-tabglobal]')
        .forEach((container) => {
            const global = container.dataset.tabglobal;
            if (!global || seen.has(global)) return;
            seen.add(global);

            const active = container.querySelector('.mdbook-tab.active');
            if (active && active.dataset.tabname) {
                params.set(global, active.dataset.tabname);
            }
        });

    const search = params.toString() ? '?' + params.toString() : '';
    history.replaceState(
        null,
        '',
        window.location.pathname + search + window.location.hash,
    );
};

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.mdbook-tab');
    for (const tab of tabs) {
        tab.addEventListener('click', () => {
            if (!(tab instanceof HTMLElement)) {
                return;
            }

            if (!tab.parentElement || !tab.parentElement.parentElement) {
                return;
            }

            const container = tab.parentElement.parentElement;
            const name = tab.dataset.tabname;
            const global = container.dataset.tabglobal;

            changeTab(container, name);

            if (global) {
                localStorage.setItem(`mdbook-tabs-${global}`, name);

                const globalContainers = document.querySelectorAll(
                    `.mdbook-tabs-container[data-tabglobal="${global}"]`,
                );
                for (const globalContainer of globalContainers) {
                    changeTab(globalContainer, name);
                }
            }

            updateTabUrlParams();
        });
    }

    // Phase 1: Restore from localStorage
    const containers = document.querySelectorAll(
        '.mdbook-tabs-container[data-tabglobal]',
    );
    for (const container of containers) {
        const global = container.dataset.tabglobal;

        const name = localStorage.getItem(`mdbook-tabs-${global}`);
        if (
            name &&
            document.querySelector(`.mdbook-tab[data-tabname="${name}"]`)
        ) {
            changeTab(container, name);
        }
    }

    // Phase 2: URL params override localStorage
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        const globalContainers = document.querySelectorAll(
            `.mdbook-tabs-container[data-tabglobal="${key}"]`,
        );
        for (const container of globalContainers) {
            if (
                container.querySelector(
                    `.mdbook-tab[data-tabname="${value}"]`,
                )
            ) {
                changeTab(container, value);
                localStorage.setItem(`mdbook-tabs-${key}`, value);
            }
        }
    }

    // Phase 3: Update URL to reflect final tab state
    if (document.querySelector('.mdbook-tabs-container[data-tabglobal]')) {
        updateTabUrlParams();
    }
});
