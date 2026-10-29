(function () {
  "use strict";
  
  if (location.protocol === "file:") {
    return;
  }

  const APP_VERSION = self.BREVIARS_VERSION || "unknown";

  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker netiek atbalstīts šajā pārlūkā.");
    return;
  }

  let deferredPrompt = null;
  let refreshing = false;
  let waitingWorker = null;
  let swRegistration = null;

  window.addEventListener("load", function () {
    registerServiceWorker();
    setupInstallPrompt();

    console.log("Breviāra PWA kontrolieris palaists. Versija:", APP_VERSION);
  });

  function registerServiceWorker() {
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshing) return;

      refreshing = true;

      console.log("Jaunais Service Worker pārņēma lapu. Pārlādējam...");
      setTimeout(function () { window.location.reload(); }, 100);
    });

	navigator.serviceWorker.register("service-worker.js", {
	  scope: "./",
	  updateViaCache: "none"
	})

    .then(function (registration) {
      swRegistration = registration;

      console.log("Service Worker reģistrēts ar scope:", registration.scope);

      // Ja service worker jau gaida aktivizāciju,
      // piemēram, lietotājs iepriekš neatjaunināja lapu.
      if (registration.waiting && navigator.serviceWorker.controller) {
        waitingWorker = registration.waiting;
        showUpdateNotification();
      }

      registration.addEventListener("updatefound", function () {
        const installingWorker = registration.installing;

        if (!installingWorker) return;

        console.log("Atrasts jauns Service Worker.");

        installingWorker.addEventListener("statechange", function () {
          console.log("Service Worker stāvoklis:", installingWorker.state);

          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Ja lapa jau tiek kontrolēta, tātad šī ir jauna versija.
              waitingWorker = registration.waiting || installingWorker;

              console.log("Pieejama jaunāka versija.");
              showUpdateNotification();
            } else {
              // Pirmā instalācija – nav jāprasa atjaunināt.
              console.log("Saturs saglabāts darbībai bez interneta.");
            }
          }
        });
      });

      function checkForUpdates() {
        if (!swRegistration) return;
        swRegistration.update().catch(function (error) {
          console.warn("Neizdevās pārbaudīt PWA atjauninājumus:", error);
        });
      }

      // Pārbaudām uzreiz un reizi stundā, kamēr aplikācija ir atvērta.
      checkForUpdates();
      setInterval(checkForUpdates, 60 * 60 * 1000);

      // Android Chrome var apturēt taimerus fonā. Pārbaudām arī atgriežoties.
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
          checkForUpdates();
        }
      });
    })
    .catch(function (error) {
      console.error("Service Worker reģistrācija neizdevās:", error);
    });
  }

  function showUpdateNotification() {
    if (document.getElementById("sw-update-notification")) return;

    const notification = document.createElement("div");
    notification.id = "sw-update-notification";

    notification.innerHTML =
      '<div style="' +
        'position: fixed;' +
        'top: 0;' +
        'left: 0;' +
        'width: 100%;' +
        'background: #fff;' +
        'color: #000;' +
        'padding: 10px;' +
        'text-align: center;' +
        'box-shadow: 0 2px 5px rgba(0,0,0,0.3);' +
        'z-index: 10000;' +
        'font-family: inherit;' +
      '">' +
        '<strong>Pieejama jaunāka versija.</strong> ' +
        '<button id="sw-update-button" class="reload" style="' +
          'margin-left: 8px;' +
          'padding: 6px 12px;' +
          'cursor: pointer;' +
        '">' +
          ' 🙏 ' +
        '</button>' +
      '</div>'; //Dievs, svētī svētceļniekus!

    document.body.appendChild(notification);

    const updateButton = document.getElementById("sw-update-button");

    if (!updateButton) return;

    updateButton.addEventListener("click", function () {
      applyServiceWorkerUpdate();
    });
  }

  function applyServiceWorkerUpdate() {
    if (waitingWorker) {
      console.log("Sūtām SKIP_WAITING jaunajam Service Worker.");

      waitingWorker.postMessage({
        type: "SKIP_WAITING"
      });

      return;
    }

    if (swRegistration && swRegistration.waiting) {
      console.log("Sūtām SKIP_WAITING reģistrācijas waiting worker.");

      swRegistration.waiting.postMessage({
        type: "SKIP_WAITING"
      });

      return;
    }

    // Rezerves variants.
    console.log("Waiting worker nav atrasts. Pārlādējam lapu.");
    window.location.reload();
  }

  function setupInstallPrompt() {
    const installButton = document.getElementById("install-button");

    if (!installButton) {
      console.warn("Instalēšanas poga #install-button nav atrasta.");
      return;
    }

    // Ja aplikācija jau palaista kā instalēta PWA, pogu nerādām.
    if (window.matchMedia("(display-mode: standalone)").matches) {
      hideInstallButton();
    }

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();

      deferredPrompt = event;

      console.log("PWA instalēšanas piedāvājums ir pieejams.");
      showInstallButton();
    });

    window.addEventListener("appinstalled", function () {
      console.log("PWA aplikācija instalēta.");

      deferredPrompt = null;
      hideInstallButton();
    });

    installButton.addEventListener("click", function () {
      installApp();
    });
  }

  function installApp() {
    if (!deferredPrompt) {
      console.log("Instalēšanas piedāvājums pašlaik nav pieejams.");
      return;
    }

    hideInstallButton();

    deferredPrompt.prompt();

    deferredPrompt.userChoice
      .then(function (choiceResult) {
        if (choiceResult.outcome === "accepted") {
          console.log("Lietotājs piekrita instalēt aplikāciju.");
        } else {
          console.log("Lietotājs noraidīja instalēšanu.");
        }

        deferredPrompt = null;
      })
      .catch(function (error) {
        console.error("Kļūda instalēšanas dialogā:", error);
        deferredPrompt = null;
      });
  }

  function showInstallButton() {
    const installButton = document.getElementById("install-button");

    if (installButton) {
      installButton.style.display = "block";
    }
  }

  function hideInstallButton() {
    const installButton = document.getElementById("install-button");

    if (installButton) {
      installButton.style.display = "none";
    }
  }
})();