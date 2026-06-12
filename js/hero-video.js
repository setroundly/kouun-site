(function () {
  const media = document.querySelector(".hero-bg-media");
  if (!media) return;

  const videos = [...media.querySelectorAll(".hero-video")];
  const fallback = media.querySelector(".hero-fallback");
  if (!videos.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    media.classList.add("is-static");
    return;
  }

  const PLAYBACK_RATE = 0.72;
  const CROSSFADE_MS = 1800;
  const FADE_BEFORE_END = 1.8;

  let currentIndex = 0;
  let isTransitioning = false;

  function setActive(index) {
    videos.forEach((video, i) => {
      video.classList.toggle("is-active", i === index);
    });
    if (fallback) {
      fallback.style.opacity = "0";
    }
  }

  function useFallback() {
    media.classList.add("is-static");
    videos.forEach((video) => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
  }

  async function playVideo(index) {
    const video = videos[index];
    if (!video) return false;

    video.playbackRate = PLAYBACK_RATE;

    try {
      await video.play();
      setActive(index);
      return true;
    } catch {
      return false;
    }
  }

  async function crossfadeTo(nextIndex) {
    if (isTransitioning || nextIndex === currentIndex) return;
    isTransitioning = true;

    const current = videos[currentIndex];
    const next = videos[nextIndex];

    next.currentTime = 0;
    next.playbackRate = PLAYBACK_RATE;
    next.classList.add("is-entering");

    try {
      await next.play();
    } catch {
      isTransitioning = false;
      next.classList.remove("is-entering");
      useFallback();
      return;
    }

    current.classList.add("is-leaving");
    next.classList.add("is-active");

    window.setTimeout(() => {
      current.pause();
      current.classList.remove("is-active", "is-leaving");
      next.classList.remove("is-entering");
      currentIndex = nextIndex;
      isTransitioning = false;
    }, CROSSFADE_MS);
  }

  videos.forEach((video, index) => {
    video.addEventListener("timeupdate", () => {
      if (index !== currentIndex || isTransitioning) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_BEFORE_END) {
        const nextIndex = (currentIndex + 1) % videos.length;
        crossfadeTo(nextIndex);
      }
    });

    video.addEventListener("error", () => {
      if (index === 0 && currentIndex === 0) {
        useFallback();
      }
    });
  });

  const firstVideo = videos[0];
  if (firstVideo.readyState >= 2) {
    playVideo(0).then((ok) => {
      if (!ok) useFallback();
    });
  } else {
    firstVideo.addEventListener(
      "canplay",
      () => {
        playVideo(0).then((ok) => {
          if (!ok) useFallback();
        });
      },
      { once: true }
    );
  }

  videos.slice(1).forEach((video) => {
    video.load();
  });
})();
