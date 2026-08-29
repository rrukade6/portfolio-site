/* ==========================================================================
   ROHIT RUKADE — PORTFOLIO
   Vanilla JS: nav, scroll reveals, video lightbox, timecode, copy-email.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
   * NAV — scrolled state, mobile toggle, active-section highlighting
   * --------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Active link based on the section in view
  var sections = document.querySelectorAll("section[id]");
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll("a:not(.nav__cta)"));

  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            var on = a.getAttribute("href") === "#" + id;
            a.classList.toggle("active", on);
            if (on) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------------------------------------------------------------
   * REVEAL on scroll (subtle fade-up)
   * --------------------------------------------------------------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------------------------------------------------------------
   * VIDEO LIGHTBOX — YouTube + Vimeo
   * Cards carry data-video (the video ID). Cards for Vimeo add the
   * class .card--vimeo and put the Vimeo ID in data-video.
   * --------------------------------------------------------------- */
  var modal = document.getElementById("videoModal");
  var frame = document.getElementById("modalFrame");
  var caption = document.getElementById("modalTitle");
  var lastTrigger = null;

  function openVideo(card) {
    var id = card.getAttribute("data-video");
    if (!id) return;
    lastTrigger = card;

    var isVimeo = card.classList.contains("card--vimeo");
    var isDrive = card.classList.contains("card--drive");
    var src;
    if (isDrive) {
      var dm = /\/d\/([^/?#]+)/.exec(id); // accept full drive.google.com/file/d/…/view URLs
      src = "https://drive.google.com/file/d/" + encodeURIComponent(dm ? dm[1] : id) + "/preview";
    } else if (isVimeo) {
      src = "https://player.vimeo.com/video/" + encodeURIComponent(id) + "?autoplay=1&title=0&byline=0&portrait=0";
    } else {
      src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
        "?autoplay=1&rel=0&modestbranding=1&color=white";
    }

    frame.setAttribute("src", src);
    frame.title = card.getAttribute("data-title") || "Video";
    caption.textContent = card.getAttribute("data-title") || "";

    modal.hidden = false;
    document.body.classList.add("no-scroll");
    modal.querySelector(".modal__close").focus();
  }

  function closeVideo() {
    if (modal.hidden) return;
    modal.hidden = true;
    frame.removeAttribute("src"); // stop playback
    document.body.classList.remove("no-scroll");
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("click", function () { openVideo(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVideo(card); }
    });
  });

  modal.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeVideo);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeVideo();

    // Minimal focus trap while the modal is open
    if (e.key === "Tab" && !modal.hidden) {
      var focusables = modal.querySelectorAll(
        "button:not([disabled]), [href], iframe, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------------------------------------------------------
   * RUNNING TIMECODE (hero) — a film-lab vibe, ticks at 24 fps
   * --------------------------------------------------------------- */
  var clock = document.getElementById("tcClock");
  if (clock && !reduced) {
    var start = Date.now();
    var FPS = 24;

    function pad(n) { return String(n).padStart(2, "0"); }

    setInterval(function () {
      var totalFrames = Math.floor((Date.now() - start) / 1000 * FPS);
      var ff = totalFrames % FPS;
      var secs = Math.floor(totalFrames / FPS);
      var ss = secs % 60;
      var mm = Math.floor(secs / 60) % 60;
      var hh = Math.floor(secs / 3600);
      clock.textContent = pad(hh) + ":" + pad(mm) + ":" + pad(ss) + ":" + pad(ff);
    }, 1000 / FPS);
  }

  /* ---------------------------------------------------------------
   * COPY EMAIL
   * --------------------------------------------------------------- */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = "rrukade6@gmail.com";
      function done() {
        copyBtn.classList.add("copied");
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          copyBtn.textContent = "Copy email";
        }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  /* ---------------------------------------------------------------
   * YEAR
   * --------------------------------------------------------------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();