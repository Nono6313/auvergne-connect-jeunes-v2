
(() => {
  const STORAGE_KEY = "acj_cookie_preferences_v1";

  const banner = document.getElementById("cookie-banner");
  const settings = document.getElementById("cookie-settings");
  const status = document.getElementById("cookie-status");

  if (!banner || !settings) return;

  const externalChoice = document.getElementById("cookie-external");
  const saveButton = document.getElementById("cookie-save");
  const acceptButton = document.getElementById("cookie-accept");
  const refuseButton = document.getElementById("cookie-refuse");
  const customizeButton = document.getElementById("cookie-customize");
  const cancelButton = document.getElementById("cookie-cancel");
  const manageButton = document.getElementById("cookie-manage");

  function readPreferences() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  function showBanner() {
    settings.hidden = true;
    banner.hidden = false;
  }

  function savePreferences(allowExternal) {
    const preferences = {
      necessary: true,
      external: Boolean(allowExternal),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      if (status) {
        status.textContent =
          "Votre navigateur n'a pas permis d'enregistrer votre choix. Vous pouvez continuer sans activer les contenus externes.";
      }
    }

    banner.hidden = true;
    settings.hidden = true;

    if (preferences.external) {
      loadApprovedContent();
    } else {
      blockExternalContent();
    }
  }

  function blockExternalContent() {
    document.querySelectorAll("[data-external-embed]").forEach((frame) => {
      frame.removeAttribute("src");
      frame.hidden = true;

      const placeholder = frame.parentElement?.querySelector(
        "[data-external-placeholder]"
      );

      if (placeholder) placeholder.hidden = false;
    });
  }

  function loadApprovedContent() {
    const preferences = readPreferences();
    if (!preferences?.external) return;

    document.querySelectorAll("[data-external-embed]").forEach((frame) => {
      const url = frame.dataset.consentSrc;
      if (!url) return;

      frame.src = url;
      frame.hidden = false;

      const placeholder = frame.parentElement?.querySelector(
        "[data-external-placeholder]"
      );

      if (placeholder) placeholder.hidden = true;
    });
  }

  acceptButton?.addEventListener("click", () => {
    savePreferences(true);
  });

  refuseButton?.addEventListener("click", () => {
    savePreferences(false);
  });

  customizeButton?.addEventListener("click", () => {
    const current = readPreferences();
    externalChoice.checked = Boolean(current?.external);
    settings.hidden = false;
  });

  saveButton?.addEventListener("click", () => {
    savePreferences(externalChoice.checked);
  });

  cancelButton?.addEventListener("click", () => {
    settings.hidden = true;
  });

  manageButton?.addEventListener("click", () => {
    const current = readPreferences();
    externalChoice.checked = Boolean(current?.external);
    banner.hidden = false;
    settings.hidden = false;
  });

  const existing = readPreferences();

  if (existing) {
    banner.hidden = true;

    if (existing.external === true) {
      loadApprovedContent();
    } else {
      blockExternalContent();
    }
  } else {
    blockExternalContent();
    showBanner();
  }
})();
