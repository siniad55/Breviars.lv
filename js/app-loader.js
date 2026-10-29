(function () {
  "use strict";

  const v = self.BREVIARS_VERSION;

  if (!v) {
    console.error("BREVIARS_VERSION nav definēts. Pārbaudi /js/version.js.");
    return;
  }

  const cssList = [
    "style",
    "calendar"
  ];

  const jsList = [
    "himnas",
    "himnasLatin",
    "template_liturgy",
    "script",
    "pieminasdienas",
    "standartabloki",
    "komplet",
    "lugsana_pll_sv",
    "psalmi",
    "parastais",
    "festum",
    "officium",
    "advents",
    "ziemassvetki",
    "gavenis",
    "lieldienas",
    "tools",
    "liturgiskaisgads",
    "calendar"
  ];

  function domReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function loadCssFiles() {
    const head = document.head || document.getElementsByTagName("head")[0];

    cssList.forEach(function (fileName) {
      const link = document.createElement("link");

      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "css/" + fileName + ".css?v=" + encodeURIComponent(v);

      head.appendChild(link);
    });
  }

  function getScriptsContainer() {
    let container = document.getElementById("scripts");

    if (!container) {
      console.warn("#scripts konteiners nav atrasts. Skripti tiks pievienoti body beigās.");

      container = document.createElement("div");
      container.id = "scripts";
      container.style.display = "none";

      document.body.appendChild(container);
    }

    return container;
  }

  function loadScript(src, container) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");

      script.src = src;
      script.async = false;

      script.onload = function () {
        resolve(src);
      };

      script.onerror = function () {
        reject(new Error("Neizdevās ielādēt skriptu: " + src));
      };

      container.appendChild(script);
    });
  }

  async function loadJsFiles() {
    const container = getScriptsContainer();

    for (const fileName of jsList) {
      const src = "js/" + fileName + ".js?v=" + encodeURIComponent(v);
      await loadScript(src, container);
    }
  }

  async function initAppLoader() {
    loadCssFiles();

    try {
      await loadJsFiles();
      console.log("Breviāra CSS un JS faili ielādēti. Versija:", v);
    } catch (error) {
      console.error(error);
    }
  }

  domReady(initAppLoader);
})();