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

  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    const idx = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    const value = bytes / Math.pow(1024, idx);
    const precision = idx === 0 ? 0 : value >= 10 ? 1 : 2;
    return `${value.toFixed(precision)} ${units[idx]}`;
  };

  const parseVersionFromName = (name) => {
    const match = String(name).match(/sulkan-([0-9]+(?:\.[0-9]+){0,3})(?:-([a-z0-9.-]+))?/i);
    if (!match) return null;
    const nums = match[1].split(".").map((n) => Number.parseInt(n, 10));
    const tag = match[2] ? String(match[2]) : "";
    const prerelease = tag ? 0 : 1;
    return { nums, prerelease, tag };
  };

  const compareVersions = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    const len = Math.max(a.nums.length, b.nums.length);
    for (let i = 0; i < len; i += 1) {
      const av = a.nums[i] ?? 0;
      const bv = b.nums[i] ?? 0;
      if (av !== bv) return av > bv ? 1 : -1;
    }
    if (a.prerelease !== b.prerelease) return a.prerelease > b.prerelease ? 1 : -1;
    if (a.tag === b.tag) return 0;
    return a.tag > b.tag ? 1 : -1;
  };

  const renderDownloadList = (container, items, filterInput) => {
    const normalized = Array.isArray(items) ? items.slice() : [];
    normalized.sort((left, right) => {
      const lv = parseVersionFromName(left?.name);
      const rv = parseVersionFromName(right?.name);
      const byVersion = compareVersions(lv, rv);
      if (byVersion !== 0) return byVersion * -1;
      const lm = Number(left?.mtime ?? 0);
      const rm = Number(right?.mtime ?? 0);
      return rm - lm;
    });

    const applyFilter = () => {
      const query = String(filterInput?.value ?? "").trim().toLowerCase();
      const filtered = query
        ? normalized.filter((it) => String(it?.name ?? "").toLowerCase().includes(query))
        : normalized;

      if (!filtered.length) {
        container.innerHTML = `<span class="muted">No matches.</span>`;
        return;
      }

      container.innerHTML = filtered
        .map((it) => {
          const name = String(it?.name ?? "download");
          const href = String(it?.path ?? "");
          const size = formatBytes(Number(it?.bytes ?? 0));
          const meta = size ? `<span class="download-meta">${size}</span>` : "";
          return `<a class="download-item" href="${href}" download>${name}${meta}</a>`;
        })
        .join("");
    };

    if (filterInput) filterInput.addEventListener("input", applyFilter);
    applyFilter();
  };

  const loadJson = async (url) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
    return res.json();
  };

  const initAllReleases = async () => {
    const list = document.getElementById("all-releases-list");
    if (!list) return;
    const filter = document.getElementById("all-releases-filter");
    try {
      const items = await loadJson("downloads/All%20Releases/index.json");
      renderDownloadList(list, items, filter);
    } catch (err) {
      list.innerHTML = `<span class="muted">Could not load archived releases.</span>`;
    }
  };

  const initLatestStable = async () => {
    const stableLink = document.getElementById("latest-stable-link");
    if (!stableLink) return;
    try {
      const items = await loadJson("downloads/Stable/index.json");
      const best = Array.isArray(items)
        ? items
            .slice()
            .sort((left, right) => {
              const lv = parseVersionFromName(left?.name);
              const rv = parseVersionFromName(right?.name);
              const byVersion = compareVersions(lv, rv);
              if (byVersion !== 0) return byVersion * -1;
              const lm = Number(left?.mtime ?? 0);
              const rm = Number(right?.mtime ?? 0);
              return rm - lm;
            })[0]
        : null;

      if (best?.path && best?.name) {
        stableLink.href = best.path;
        stableLink.textContent = `Direct .jar download (${best.name})`;
      }
    } catch (err) {
      // Leave the static link in place.
    }
  };

  initLatestStable();
  initAllReleases();
});
