document.addEventListener("DOMContentLoaded", () => {
  // Reveal animations
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

  // Nav active
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.classList.add("active");
  });

  // Hamburger menu
  const hamburger = document.querySelector('.topbar-inner');
  const nav = document.querySelector('.nav');
  
  if (window.innerWidth <= 760) {
    nav.classList.add('hidden');
    // Add hamburger HTML dynamically
    const hamHTML = '<div class="hamburger" id="hamburger"><span></span><span></span><span></span></div>';
    hamburger.insertAdjacentHTML('beforeend', hamHTML);
    
    const hamBtn = document.getElementById('hamburger');
    hamBtn.addEventListener('click', () => {
      nav.classList.toggle('hidden');
      hamBtn.classList.toggle('open');
    });
  }

  // Close nav on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      nav.classList.remove('hidden');
    }
  });
});
