/* The Room — search, filters, and rendering.
   Data lives in communities.json. Edit that file; nothing here needs to change. */
(function () {
  "use strict";

  // Section order on the page. Any category not listed here is added at the end.
  var ORDER = [
    "Fractional",
    "Marketing and strategy",
    "Comms and PR",
    "Agency owners",
    "Founders",
    "Executive and leadership",
    "Speaking",
    "Tech",
    "Retail and ecommerce",
    "CPG",
    "HR and recruiting",
    "Finance and investing",
    "General professional"
  ];

  var FEE = { free: "Free", paid: "Paid", unknown: "Fee not listed" };
  var JOIN = { open: "Open to join", referral: "Referral or invite", unknown: "Joining details not listed" };

  var state = { q: "", women: false, free: false, open: false, cat: "" };
  var groups = [];
  var categories = [];

  var el = {
    q: document.getElementById("q"),
    cats: document.getElementById("cats"),
    count: document.getElementById("count"),
    results: document.getElementById("results"),
    empty: document.getElementById("empty"),
    clear: document.getElementById("clear"),
    toggles: document.querySelectorAll("[data-toggle]")
  };

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function safeUrl(u) {
    if (!u) return null;
    try {
      var p = new URL(u.trim());
      return p.protocol === "https:" || p.protocol === "http:" ? p.href : null;
    } catch (e) { return null; }
  }

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "");
  }

  function haystack(g) {
    return norm([g.name, g.description, g.note, g.categories.join(" "), g.women ? "women women-focused" : "", FEE[g.fee], JOIN[g.joining]].join(" "));
  }

  function matches(g) {
    if (state.women && !g.women) return false;
    if (state.free && g.fee !== "free") return false;
    if (state.open && g.joining !== "open") return false;
    if (state.cat && g.categories.indexOf(state.cat) === -1) return false;
    if (state.q) {
      var terms = norm(state.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) if (g._hay.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  function renderGroup(g, idx) {
    var row = h("article", "group");
    row.id = g.id;

    row.appendChild(h("span", "group__idx", String(idx).padStart(2, "0")));

    var main = h("div", "group__main");
    var name = h("h3", "group__name");
    var url = safeUrl(g.url);
    if (url) {
      var a = h("a", null, g.name);
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      var arrow = h("span", "arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      a.appendChild(arrow);
      var sr = h("span", "visually-hidden", " (opens in a new tab)");
      a.appendChild(sr);
      name.appendChild(a);
    } else {
      name.textContent = g.name;
    }
    main.appendChild(name);

    if (g.description) main.appendChild(h("p", "group__desc", g.description));
    if (g.note) main.appendChild(h("p", "group__note", g.note));
    if (!url) main.appendChild(h("p", "group__nolink", "No public link."));
    row.appendChild(main);

    var tags = h("ul", "tags");
    tags.setAttribute("aria-label", "Details");
    tags.appendChild(h("li", "tag tag--" + g.fee, FEE[g.fee]));
    tags.appendChild(h("li", "tag tag--" + g.joining, JOIN[g.joining]));
    if (g.women) tags.appendChild(h("li", "tag tag--women", "Women-focused"));
    // The first category is the section heading; show any others as tags.
    g.categories.slice(1).forEach(function (c) { tags.appendChild(h("li", "tag", c)); });
    row.appendChild(tags);

    return row;
  }

  function render() {
    var shown = groups.filter(matches);
    var total = groups.length;
    var filtered = state.q || state.women || state.free || state.open || state.cat;

    el.count.textContent = filtered
      ? "Showing " + shown.length + " of " + total + " groups"
      : total + " groups";
    if (filtered && shown.length) {
      var reset = h("button", "link-button count__clear", "Clear filters");
      reset.type = "button";
      reset.addEventListener("click", clearAll);
      el.count.appendChild(reset);
    }

    el.results.textContent = "";
    el.empty.hidden = shown.length > 0;

    var n = 0;
    categories.forEach(function (cat) {
      var inCat = shown.filter(function (g) { return g.categories[0] === cat; });
      if (!inCat.length) return;
      var sec = h("section", "section");
      var head = h("div", "section__head");
      head.appendChild(h("h2", "section__title", cat));
      head.appendChild(h("span", "section__n", inCat.length + (inCat.length === 1 ? " group" : " groups")));
      sec.appendChild(head);
      inCat.forEach(function (g) { sec.appendChild(renderGroup(g, ++n)); });
      el.results.appendChild(sec);
    });

    syncControls();
    writeUrl();
  }

  function syncControls() {
    el.toggles.forEach(function (b) { b.setAttribute("aria-pressed", String(!!state[b.dataset.toggle])); });
    el.cats.querySelectorAll(".cat").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)); });
    if (el.q.value !== state.q) el.q.value = state.q;
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.women) p.set("women", "1");
    if (state.free) p.set("free", "1");
    if (state.open) p.set("open", "1");
    if (state.cat) p.set("focus", state.cat);
    var qs = p.toString();
    try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash); } catch (e) {}
  }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    state.q = p.get("q") || "";
    state.women = p.get("women") === "1";
    state.free = p.get("free") === "1";
    state.open = p.get("open") === "1";
    var f = p.get("focus") || "";
    state.cat = categories.indexOf(f) > -1 ? f : "";
  }

  function buildCats() {
    var all = h("button", "cat", "All");
    all.type = "button";
    all.dataset.cat = "";
    el.cats.appendChild(all);
    categories.forEach(function (c) {
      var b = h("button", "cat", c);
      b.type = "button";
      b.dataset.cat = c;
      el.cats.appendChild(b);
    });
    el.cats.addEventListener("click", function (e) {
      var b = e.target.closest(".cat");
      if (!b) return;
      state.cat = b.dataset.cat;
      render();
    });
  }

  function clearAll() {
    state = { q: "", women: false, free: false, open: false, cat: "" };
    render();
    el.q.focus();
  }

  function init(data) {
    groups = (data.groups || []).map(function (g) {
      g.categories = g.categories || [];
      g.fee = FEE[g.fee] ? g.fee : "unknown";
      g.joining = JOIN[g.joining] ? g.joining : "unknown";
      g._hay = haystack(g);
      return g;
    });

    var seen = {};
    groups.forEach(function (g) { g.categories.forEach(function (c) { seen[c] = true; }); });
    categories = ORDER.filter(function (c) { return seen[c]; })
      .concat(Object.keys(seen).filter(function (c) { return ORDER.indexOf(c) === -1; }));

    buildCats();
    readUrl();
    render();

    var t;
    el.q.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = el.q.value.trim(); render(); }, 120);
    });
    el.toggles.forEach(function (b) {
      b.addEventListener("click", function () { state[b.dataset.toggle] = !state[b.dataset.toggle]; render(); });
    });
    el.clear.addEventListener("click", clearAll);
  }

  fetch("communities.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(init)
    .catch(function () {
      el.count.textContent = "";
      el.results.appendChild(h("p", "group__desc--missing", "The list didn’t load. Refresh the page, or email gina@itsagoodstory.com and I’ll send it over."));
    });
})();
