document.addEventListener("DOMContentLoaded", () => {
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => observer.observe(el));

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.classList.add("active");
  });

  const nav = document.querySelector(".nav");
  const hamBtn = document.getElementById("hamburger");

  if (!nav || !hamBtn) return;

  const syncNavState = () => {
    const mobile = window.innerWidth <= 760;
    if (mobile) {
      nav.classList.add("hidden");
      hamBtn.setAttribute("aria-expanded", "false");
      hamBtn.classList.remove("open");
    } else {
      nav.classList.remove("hidden");
      hamBtn.setAttribute("aria-expanded", "false");
      hamBtn.classList.remove("open");
    }
  };

  hamBtn.addEventListener("click", () => {
    const willOpen = nav.classList.contains("hidden");
    nav.classList.toggle("hidden");
    hamBtn.classList.toggle("open", willOpen);
    hamBtn.setAttribute("aria-expanded", String(willOpen));
  });

  window.addEventListener("resize", syncNavState);
  syncNavState();
});
