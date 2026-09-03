/* ==========================================================================
   Xiangyu Zhang — personal academic site
   Vanilla JS: starfield, reveal-on-scroll, scrollspy, mobile nav, like button.
   ========================================================================== */
(function () {
	"use strict";

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var finePointer = window.matchMedia("(pointer: fine)").matches;

	/* ---------- Leave the preload state once the first frame is ready ---------- */
	function enableMotion() {
		document.body.classList.remove("is-preload");
	}
	if (document.readyState === "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			requestAnimationFrame(enableMotion);
		});
	} else {
		requestAnimationFrame(enableMotion);
	}

	/* ---------- Header elevation on scroll ---------- */
	var header = document.getElementById("siteHeader");
	var headerTicking = false;

	function updateHeader() {
		header.classList.toggle("is-scrolled", window.scrollY > 10);
		headerTicking = false;
	}

	window.addEventListener("scroll", function () {
		if (!headerTicking) {
			headerTicking = true;
			requestAnimationFrame(updateHeader);
		}
	}, { passive: true });
	updateHeader();

	/* ---------- Mobile navigation ---------- */
	var navToggle = document.getElementById("navToggle");
	var siteNav = document.getElementById("siteNav");

	function closeNav() {
		siteNav.classList.remove("is-open");
		navToggle.setAttribute("aria-expanded", "false");
	}

	navToggle.addEventListener("click", function () {
		var open = siteNav.classList.toggle("is-open");
		navToggle.setAttribute("aria-expanded", open ? "true" : "false");
	});

	siteNav.addEventListener("click", function (event) {
		if (event.target.closest("a")) closeNav();
	});

	window.addEventListener("keydown", function (event) {
		if (event.key === "Escape") closeNav();
	});

	/* ---------- Scrollspy: highlight the section currently in view ---------- */
	var navLinks = Array.prototype.slice.call(siteNav.querySelectorAll("a"));
	var spySections = navLinks
		.map(function (link) {
			var id = link.getAttribute("href");
			return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
		})
		.filter(Boolean);

	if ("IntersectionObserver" in window && spySections.length) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var id = "#" + entry.target.id;
				navLinks.forEach(function (link) {
					link.classList.toggle("is-active", link.getAttribute("href") === id);
				});
			});
		}, {
			rootMargin: "-35% 0px -58% 0px"
		});

		spySections.forEach(function (section) {
			spy.observe(section);
		});
	}

	/* ---------- Reveal-on-scroll ---------- */
	var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

	if ("IntersectionObserver" in window && !reduceMotion) {
		var revealObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("in");
					revealObserver.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.12,
			rootMargin: "0px 0px -7% 0px"
		});
		revealEls.forEach(function (el) {
			revealObserver.observe(el);
		});
	} else {
		revealEls.forEach(function (el) {
			el.classList.add("in");
		});
	}

	/* ---------- Starfield ---------- */
	var canvas = document.getElementById("stardust");
	var ctx = canvas.getContext("2d");
	var stars = [];
	var starColors = ["255,255,255", "182,214,255", "214,199,255", "255,224,173"];
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W = 0;
	var H = 0;

	function buildStars() {
		var count = Math.max(70, Math.min(240, Math.round((W * H) / 11000)));
		stars = [];
		for (var i = 0; i < count; i += 1) {
			stars.push({
				x: Math.random() * W,
				y: Math.random() * H,
				radius: Math.random() * 1.05 + 0.35,
				alpha: Math.random() * 0.55 + 0.2,
				speed: Math.random() * 0.9 + 0.25,
				phase: Math.random() * Math.PI * 2,
				color: starColors[i % starColors.length]
			});
		}
	}

	function resizeCanvas() {
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = Math.round(W * dpr);
		canvas.height = Math.round(H * dpr);
		canvas.style.width = W + "px";
		canvas.style.height = H + "px";
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		buildStars();
		if (reduceMotion) drawStars(1);
	}

	function drawStars(time) {
		ctx.clearRect(0, 0, W, H);
		for (var i = 0; i < stars.length; i += 1) {
			var s = stars[i];
			var twinkle = reduceMotion
				? 1
				: (Math.sin(time * 0.001 * s.speed + s.phase) + 1) / 2;
			var a = s.alpha * (0.55 + 0.45 * twinkle);
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(" + s.color + "," + a.toFixed(3) + ")";
			ctx.fill();
		}
	}

	function animateStars(time) {
		drawStars(time);
		requestAnimationFrame(animateStars);
	}

	resizeCanvas();
	window.addEventListener("resize", resizeCanvas, { passive: true });
	if (!reduceMotion) requestAnimationFrame(animateStars);

	/* ---------- Subtle mouse parallax on the hero portrait ---------- */
	var heroVisual = document.querySelector(".hero-visual");

	if (heroVisual && finePointer && !reduceMotion) {
		var hero = document.getElementById("top");
		var parTicking = false;
		var parX = 0;
		var parY = 0;

		hero.addEventListener("pointermove", function (event) {
			if (parTicking) return;
			parTicking = true;
			requestAnimationFrame(function () {
				var rect = hero.getBoundingClientRect();
				parX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
				parY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
				heroVisual.style.transform = "translate(" + parX.toFixed(2) + "px," + parY.toFixed(2) + "px)";
				parTicking = false;
			});
		}, { passive: true });

		hero.addEventListener("pointerleave", function () {
			heroVisual.style.transform = "translate(0,0)";
		}, { passive: true });
	}

	/* ---------- Like counter (persisted in this browser) ---------- */
	var likeKey = "xyzhang_site_likes";
	var likeCount = 0;
	try {
		likeCount = parseInt(window.localStorage.getItem(likeKey), 10) || 0;
	} catch (error) {
		likeCount = 0;
	}

	var likeBtn = document.getElementById("likeBtn");
	var likeNote = document.getElementById("likeNote");

	function renderLikes() {
		if (likeCount === 0) {
			likeNote.textContent = "Thanks for visiting — tap the heart if this page helped you find something!";
			likeBtn.classList.remove("is-liked");
		} else {
			likeNote.textContent = "You’ve liked this page " + likeCount + (likeCount === 1 ? " time" : " times") + " (saved in your browser).";
			likeBtn.classList.add("is-liked");
		}
	}

	likeBtn.addEventListener("click", function () {
		likeCount += 1;
		try {
			window.localStorage.setItem(likeKey, String(likeCount));
		} catch (error) {
			/* private mode or quota — counter still works for this visit */
		}
		renderLikes();
	});
	renderLikes();

	/* ---------- Footer year ---------- */
	var yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
