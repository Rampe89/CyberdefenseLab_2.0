
(function () {
  function byId(id) { return document.getElementById(id); }
  function revealWithPassword(inputId, containerId, contentId, errorId, password) {
    var input = byId(inputId);
    var container = byId(containerId);
    var content = byId(contentId);
    var error = byId(errorId);
    if (!input || !container || !content) return;
    if ((input.value || "").trim() === password) {
      container.classList.add("hidden");
      content.classList.remove("hidden");
      if (error) error.classList.add("hidden");
    } else {
      if (error) error.classList.remove("hidden");
    }
  }

  window.unlockAnalysis = function () {
    revealWithPassword("analysis-password", "analysis-password-container", "analysis-tasks", "analysis-error-message", atob("dXNlcjEyMw=="));
  };

  window.unlockAdvanced = function () {
    revealWithPassword("advanced-password", "advanced-password-container", "advanced-tasks", "advanced-error-message", atob("QXJjaGl2ZURlbHRhMjc="));
  };

  window.unlockTeacher = function () {
    revealWithPassword("teacher-password", "teacher-password-container", "teacher-content", "teacher-error-message", atob("VGVhY2hlcnMxeDE="));
  };

  window.unlockTasks = function () {
    window.unlockAnalysis();
  };

  function patchCookieBanner() {
    var banner = document.querySelector(".cookie-banner");
    if (!banner) return;

    try {
      var stored = localStorage.getItem("cdl-cookie-choice");
      if (stored) {
        banner.style.display = "none";
        return;
      }
    } catch (e) {}

    var buttons = banner.querySelectorAll("button, .btn");
    buttons.forEach(function (btn) {
      var label = (btn.textContent || "").toLowerCase();
      if (label.includes("akzept") || label.includes("ablehn") || label.includes("declin") || label.includes("accept")) {
        btn.addEventListener("click", function () {
          try { localStorage.setItem("cdl-cookie-choice", label); } catch (e) {}
          banner.style.display = "none";
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    patchCookieBanner();
  });
})();
