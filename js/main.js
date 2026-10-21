/* 表示用のスクリプト。中身の編集は data.js で行ってください。 */
(function () {
  "use strict";

  var page = document.body.dataset.page;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function workUrl(w) { return "work.html?id=" + encodeURIComponent(w.id); }
  function typeLabel(t) { return t === "solo" ? "個人制作" : t === "team" ? "チーム制作" : "制作形態 未設定"; }
  function findWork(id) { return WORKS.filter(function (w) { return w.id === id; })[0]; }
  function cur(cond) { return cond ? ' aria-current="page"' : ""; }

  /* ---------- 作品ページの目次 ---------- */
  function buildToc(root) {
    var secs = root.querySelectorAll(".detail-section");
    if (secs.length < 3) return;
    var links = [];
    Array.prototype.forEach.call(secs, function (s, i) {
      var h = s.querySelector("h2");
      if (!h) return;
      s.id = "sec-" + (i + 1);
      links.push('<li><a href="#' + s.id + '">' + esc(h.textContent) + "</a></li>");
    });
    var nav = document.createElement("nav");
    nav.className = "detail-toc";
    nav.setAttribute("aria-label", "このページの目次");
    nav.innerHTML = "<ul>" + links.join("") + "</ul>";
    secs[0].parentNode.insertBefore(nav, secs[0]);
    if (!("IntersectionObserver" in window)) return;
    var ul = nav.firstChild;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) {
          var on = a.getAttribute("href") === "#" + e.target.id;
          a.classList.toggle("is-current", on);
          if (on) ul.scrollLeft = a.parentNode.offsetLeft - 16;
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    Array.prototype.forEach.call(secs, function (s) { io.observe(s); });
  }

  /* ---------- スクロールでふわっと表示 ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealIO = ("IntersectionObserver" in window && !reduceMotion) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add("is-visible");
      revealIO.unobserve(el);
      setTimeout(function () { el.style.transitionDelay = ""; }, 900);
    });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function reveal() {
    if (!revealIO) return;
    document.documentElement.classList.add("js-reveal");
    var els = document.querySelectorAll(".work-card, .philo-item, .plan-item, .detail-section, .ai-entry, .version, .snippet, .contact-list li");
    var n = 0;
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.revealed) return;
      el.dataset.revealed = "1";
      el.style.transitionDelay = (n++ % 4) * 70 + "ms";
      revealIO.observe(el);
    });
  }

  /* ---------- 共通：ヘッダー ---------- */
  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;
    var sub = WORKS.map(function (w) {
      return '<li><a href="' + workUrl(w) + '">' + esc(w.title) + "</a></li>";
    }).join("");
    el.innerHTML =
      '<div class="header-inner">' +
        '<a class="logo" href="index.html">' + esc(SITE.nameEn && SITE.nameEn !== "PORTFOLIO" ? SITE.nameEn : SITE.name) + "</a>" +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="global-nav">' +
          '<span class="menu-bars" aria-hidden="true"></span><span class="menu-text">メニュー</span></button>' +
        '<nav id="global-nav" class="global-nav" aria-label="サイト内メニュー"><ul class="nav-list">' +
          '<li><a href="index.html"' + cur(page === "home") + ">Home / About</a></li>" +
          '<li class="has-sub"><a href="works.html"' + cur(page === "works" || page === "work") + ">Works</a>" +
            '<ul class="sub-list">' + sub + "</ul></li>" +
          '<li><a href="ai.html"' + cur(page === "ai" || page === "ai-detail") + ">AI Research</a></li>" +
        "</ul></nav>" +
      "</div>";
    var btn = el.querySelector(".menu-btn");
    var nav = el.querySelector(".global-nav");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  /* ---------- 共通：フッター ---------- */
  function renderFooter() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML =
      '<div class="footer-inner">' +
        '<p class="footer-name">' + esc(SITE.name) + "｜" + esc(SITE.role) + "</p>" +
        '<ul class="footer-nav">' +
          '<li><a href="index.html">Home / About</a></li>' +
          '<li><a href="works.html">Works</a></li>' +
          '<li><a href="ai.html">AI Research</a></li>' +
          '<li><a href="index.html#home-skills-h">Skills</a></li>' +
          '<li><a href="index.html#contact-h">Contact</a></li>' +
        "</ul>" +
        '<p class="footer-copy">&copy; ' + new Date().getFullYear() + " " + esc(SITE.name) + "</p>" +
      "</div>";
  }

  /* ---------- 作品カード ---------- */
  function thumb(w, cls) {
    if (w.thumbnail) {
      return '<div class="' + cls + ' project-media" data-project-media>' +
        '<div class="asset-fallback" aria-hidden="true"><span>' + esc(w.title) + '</span></div>' +
        '<img class="asset-picture" src="' + esc(w.thumbnail) + '" alt="' + esc(w.title) + 'のゲーム画面" loading="lazy">' +
        "</div>";
    }
    return '<div class="' + cls + ' thumb-empty" aria-hidden="true"><span>' + esc(w.title) + "</span></div>";
  }
  function syncProjectMedia(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-project-media]"), function (holder) {
      var img = holder.querySelector("img");
      if (!img || img.dataset.mediaReady) return;
      img.dataset.mediaReady = "1";
      function loaded() { if (img.naturalWidth > 0) holder.classList.add("is-loaded"); }
      img.addEventListener("load", loaded);
      if (img.complete) loaded();
    });
  }
  function specList(w, cls) {
    return '<dl class="' + cls + '">' +
      "<div><dt>開発環境</dt><dd>" + esc(w.engine) + "</dd></div>" +
      "<div><dt>制作人数</dt><dd>" + esc(w.teamSize) + "</dd></div>" +
      "<div><dt>制作期間</dt><dd>" + esc(w.period) + "</dd></div>" +
      "<div><dt>担当</dt><dd>" + esc(w.role) + "</dd></div>" +
    "</dl>";
  }
  function card(w) {
    var subtitle = (w.subtitle || "").includes("［") ? "" : (w.subtitle || "");
    var summary = (w.summary || "").includes("［") ? "" : (w.summary || "");
    return '<article class="work-card">' +
      '<a class="work-card-link" href="' + workUrl(w) + '">' +
        '<div class="work-card-media">' + thumb(w, "work-card-img") +
          (w.type ? '<span class="tag tag-' + esc(w.type) + '">' + typeLabel(w.type) + "</span>" : "") + "</div>" +
        '<div class="work-card-body">' +
          '<span class="work-card-kicker">GAME DEVELOPMENT</span>' +
          '<h3 class="work-card-title">' + esc(w.title) + "</h3>" +
          (subtitle ? '<p class="work-card-sub">' + esc(subtitle) + "</p>" : "") +
          (summary ? '<p class="work-card-desc">' + esc(summary) + "</p>" : "") +
          '<div class="work-card-bottom"><div class="card-tags"><span>' + esc(w.engine || "Unity") + '</span>' +
          (w.type ? '<span>' + esc(typeLabel(w.type)) + "</span>" : "") + "</div>" +
          '<span class="work-card-more">詳細を見る</span></div>' +
        "</div></a></article>";
  }

  /* ---------- HOME / ABOUT ---------- */
  function renderHome() {
    var set = function (id, html) { var e = document.getElementById(id); if (e) e.innerHTML = html; };
    set("hero-name", esc(SITE.name));
    set("hero-role", '<span class="hero-person">' + esc(SITE.name) + "</span>" + esc(SITE.role) + "志望");
    set("hero-catch", esc(SITE.catchphrase && !SITE.catchphrase.includes("［") ? SITE.catchphrase : "Unity・C#を中心に、ゲーム制作とAIを活用した開発環境づくりに取り組んでいます。"));
    set("hero-school", SITE.school && !SITE.school.includes("［") ? esc(SITE.school) + "　" + esc(SITE.department && !SITE.department.includes("［") ? SITE.department : "") : "");
    var heroSkills = (typeof SKILLS !== "undefined" ? SKILLS : []).slice(0, 5).map(function (s) {
      return "<li>" + esc(s.name) + "</li>";
    }).join("");
    var aiCount = typeof AI_RESEARCH !== "undefined" ? AI_RESEARCH.length : 0;
    set("hero-meta",
      (heroSkills ? '<ul class="hero-skills" aria-label="主な使用技術">' + heroSkills + "</ul>" : "") +
      '<dl class="hero-stats"><div><dt>WORKS</dt><dd>' + WORKS.length + "</dd></div>" +
      (aiCount ? "<div><dt>AI RESEARCH</dt><dd>" + aiCount + "</dd></div>" : "") + "</dl>");

    var src = (SITE.nameEn && SITE.nameEn !== "PORTFOLIO" ? SITE.nameEn : SITE.name).replace(/［[^］]*］/g, "").trim();
    var initial = src.charAt(0);
    set("profile-photo", SITE.photo
      ? '<img src="' + esc(SITE.photo) + '" alt="' + esc(SITE.name) + 'の写真">'
      : '<span class="photo-initial" aria-hidden="true">' + esc(initial) + "</span>");

    var rows = [
      ["名前", SITE.name], ["学校", SITE.school, SITE.schoolUrl], ["学科・専攻", SITE.department],
      ["卒業", SITE.graduation], ["志望職種", SITE.role], ["好きなジャンル", SITE.favoriteGenres]
    ];
    set("profile-table", rows.map(function (r) {
      var val = r[2] ? '<a href="' + esc(r[2]) + '" target="_blank" rel="noopener">' + esc(r[1]) + "</a>" : esc(r[1]);
      return "<div><dt>" + esc(r[0]) + "</dt><dd>" + val + "</dd></div>";
    }).join(""));
    set("intro", SITE.intro.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""));
    set("philosophy", SITE.philosophy.map(function (p) {
      return '<li class="philo-item"><h3>' + esc(p.title) + "</h3><p>" + esc(p.body) + "</p></li>";
    }).join(""));
    if (typeof PLANNING !== "undefined") {
      set("planning", PLANNING.map(function (p) {
        var href = p.workId && findWork(p.workId) ? workUrl(findWork(p.workId)) : (p.link || "");
        var title = href ? '<a href="' + esc(href) + '">' + esc(p.title) + "</a>" : esc(p.title);
        return '<li class="plan-item"><div class="plan-head"><span class="plan-title">' + title + "</span>" +
          '<span class="tag tag-status plan-role">' + esc(p.role) + "</span></div>" +
          "<p>" + esc(p.body) + "</p></li>";
      }).join(""));
    }
    set("featured", WORKS.slice(0, 3).map(card).join(""));
    set("home-research", AI_RESEARCH.map(function (r, i) { return researchCard(r, i, true); }).join(""));
    set("home-skills", SKILLS.map(function (skill) {
      var related = (skill.works || []).map(findWork).filter(Boolean);
      var links = related.length ? '<div class="home-skill-works"><span>使用作品</span>' +
        related.map(function (w) { return '<a href="' + workUrl(w) + '">' + esc(w.title) + '</a>'; }).join("") +
        "</div>" : "";
      var note = skill.note && !skill.note.includes("［") ? '<p class="home-skill-note">' + esc(skill.note) + "</p>" : "";
      return '<li class="home-skill-card"><h3>' + esc(skill.name) + "</h3>" + note + links + "</li>";
    }).join(""));
  }

  /* ---------- WORKS ---------- */
  function renderWorks() {
    var grid = document.getElementById("works-grid");
    var count = document.getElementById("works-count");
    var buttons = document.querySelectorAll(".filter-btn");
    function draw(filter) {
      var list = WORKS.filter(function (w) { return filter === "all" || w.type === filter; });
      grid.innerHTML = list.length
        ? list.map(card).join("")
        : '<p class="empty">この条件の作品はまだありません。data.js に作品を追加すると表示されます。</p>';
      count.textContent = list.length + "作品";
      syncProjectMedia(grid);
      reveal();
    }
    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(buttons, function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        draw(b.dataset.filter);
      });
    });
    draw("all");
  }

  /* ---------- 作品詳細 ---------- */
  function renderWork() {
    var main = document.getElementById("work-detail");
    var id = new URLSearchParams(location.search).get("id");
    var w = id ? findWork(id) : WORKS[0];
    if (!w) {
      main.innerHTML = '<div class="container not-found"><h1>作品が見つかりません</h1>' +
        "<p>URLの id が data.js の作品と一致しているか確認してください。</p>" +
        '<p><a class="btn" href="works.html">作品一覧に戻る</a></p></div>';
      return;
    }
    document.title = w.title + "｜" + SITE.name;
    var idx = WORKS.indexOf(w);
    var prev = WORKS[idx - 1], next = WORKS[idx + 1];

    var media = w.youtube
      ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(w.youtube) +
        '" title="' + esc(w.title) + 'のプレイ動画" allowfullscreen loading="lazy"></iframe></div>'
      : w.localVideo
        ? '<div class="local-video-holder" data-local-video="' + esc(w.localVideo) +
          '" data-poster="' + esc(w.thumbnail || "") + '">' + thumb(w, "detail-hero-img") + '</div>'
        : thumb(w, "detail-hero-img");

    var shots = (w.screenshots || []).length
      ? '<div class="shots">' + w.screenshots.map(function (s, i) {
          return '<a href="' + esc(s) + '" target="_blank" rel="noopener"><img src="' + esc(s) +
            '" alt="' + esc(w.title) + "のスクリーンショット" + (i + 1) + '" loading="lazy"></a>';
        }).join("") + "</div>"
      : '<p class="placeholder-note">スクリーンショットは data.js の screenshots に画像のパスを追加すると表示されます。</p>';

    var links = (w.links || []).length
      ? '<ul class="link-list">' + w.links.map(function (l) {
          return '<li><a class="btn btn-ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a></li>";
        }).join("") + "</ul>"
      : "";

    var snippets = "";
    if ((w.code || []).length) {
      snippets = '<section class="detail-section"><h2>コード抜粋</h2>' + w.code.map(function (c) {
        return '<div class="snippet">' +
          (c.title ? "<h3>" + esc(c.title) + "</h3>" : "") +
          (c.note ? '<p class="snippet-note">' + esc(c.note) + "</p>" : "") +
          '<div class="code-block">' + (c.file ? '<div class="code-file">' + esc(c.file) + "</div>" : "") +
          "<pre><code>" + esc(c.body) + "</code></pre></div></div>";
      }).join("") + "</section>";
    }

    var versions = "";
    if ((w.versions || []).length) {
      versions = '<section class="detail-section"><h2>' + esc(w.versionsTitle || "初代とリメイク") + '</h2><div class="versions">' +
        w.versions.map(function (v) {
          var pts = (v.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
          return '<div class="version"><h3>' + esc(v.label) + "</h3>" +
            '<dl class="spec">' +
              "<div><dt>制作人数</dt><dd>" + esc(v.teamSize) + "</dd></div>" +
              "<div><dt>開発環境</dt><dd>" + esc(v.engine) + "</dd></div>" +
              "<div><dt>状況</dt><dd>" + esc(v.context) + "</dd></div>" +
            "</dl>" +
            (pts ? '<ul class="code-list">' + pts + "</ul>" : "") +
          "</div>";
        }).join("") + "</div></section>";
    }

    main.innerHTML =
      '<div class="container">' +
        '<nav class="breadcrumb" aria-label="現在地"><a href="works.html">Works</a><span aria-hidden="true">/</span><span>' + esc(w.title) + "</span></nav>" +
        '<header class="detail-head">' +
          '<div class="detail-tags"><span class="tag tag-' + esc(w.type) + '">' + typeLabel(w.type) + "</span>" +
            (w.status ? '<span class="tag tag-status">' + esc(w.status) + "</span>" : "") + "</div>" +
          '<h1 class="detail-title">' + esc(w.title) + "</h1>" +
          (w.subtitle ? '<p class="detail-sub">' + esc(w.subtitle) + "</p>" : "") +
          (w.summary ? '<p class="detail-summary">' + esc(w.summary) + "</p>" : "") +
        "</header>" +
        '<div class="detail-top">' +
          '<div class="detail-media">' + media + "</div>" +
          '<aside class="detail-spec">' + specList(w, "spec spec-lg") + links + "</aside>" +
        "</div>" +

        versions +

        '<section class="detail-section"><h2>ゲーム紹介</h2>' +
          (w.description || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</section>" +

        '<section class="detail-section"><h2>スクリーンショット</h2>' + shots + "</section>" +

        '<section class="detail-section"><h2>担当したプログラム</h2><ul class="code-list">' +
          (w.myCode || []).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></section>" +

        snippets +

        '<section class="detail-section"><h2>実装で工夫した点</h2><div class="idea-list">' +
          (w.ideas || []).map(function (i) {
            return '<div class="idea"><h3>' + esc(i.title) + "</h3><p>" + esc(i.body) + "</p></div>";
          }).join("") + "</div></section>" +

        '<section class="detail-section"><h2>発生した問題と解決方法</h2><div class="trouble-list">' +
          (w.problems || []).map(function (p) {
            return '<div class="trouble">' +
              '<div class="trouble-q"><span class="trouble-label">問題</span><p>' + esc(p.problem) + "</p></div>" +
              '<div class="trouble-a"><span class="trouble-label">解決</span><p>' + esc(p.solution) + "</p></div>" +
            "</div>";
          }).join("") + "</div></section>" +

        '<nav class="pager" aria-label="ほかの作品">' +
          (prev ? '<a class="pager-prev" href="' + workUrl(prev) + '"><small>前の作品</small>' + esc(prev.title) + "</a>" : "<span></span>") +
          '<a class="pager-all" href="works.html">作品一覧</a>' +
          (next ? '<a class="pager-next" href="' + workUrl(next) + '"><small>次の作品</small>' + esc(next.title) + "</a>" : "<span></span>") +
        "</nav>" +
      "</div>";
    if (!(w.problems || []).length) {
      Array.prototype.forEach.call(main.querySelectorAll(".detail-section"), function (s) {
        var h = s.querySelector("h2");
        if (h && h.textContent === "発生した問題と解決方法") s.parentNode.removeChild(s);
      });
    }
    buildToc(main);
    syncProjectMedia(main);
    /* Only activate the player once its asset is actually published to GitHub Pages. */
    var videoHolder = main.querySelector("[data-local-video]");
    if (videoHolder && typeof fetch === "function") {
      var movieUrl = videoHolder.dataset.localVideo;
      fetch(movieUrl, { method: "HEAD" }).then(function (response) {
        if (!response.ok || !videoHolder.isConnected) return;
        var movie = document.createElement("video");
        movie.controls = true;
        movie.preload = "metadata";
        movie.playsInline = true;
        movie.setAttribute("aria-label", w.title + "のプレイ動画");
        if (w.thumbnail) movie.poster = w.thumbnail;
        var source = document.createElement("source");
        source.src = movieUrl;
        source.type = "video/mp4";
        movie.appendChild(source);
        videoHolder.replaceChildren(movie);
        videoHolder.classList.add("has-video");
      }).catch(function () { /* Thumbnail remains visible when video is not uploaded. */ });
    }
  }

  /* ---------- SKILLS / CONTACT ---------- */
  function renderSkills() {
    var body = document.getElementById("skills-body");
    if (body) body.innerHTML = SKILLS.map(function (s) {
      var lv = Number(s.level) || 0;
      var pips = lv
        ? '<span class="pips" role="img" aria-label="習熟度 5段階中' + lv + '">' +
            [1, 2, 3, 4, 5].map(function (n) { return '<i class="' + (n <= lv ? "on" : "") + '"></i>'; }).join("") + "</span>"
        : '<span class="pips-unset">未設定</span>';
      var works = (s.works || []).map(findWork).filter(Boolean).map(function (w) {
        return '<a href="' + workUrl(w) + '">' + esc(w.title) + "</a>";
      }).join("");
      return "<tr>" +
        '<th scope="row">' + esc(s.name) + (s.note ? '<small>' + esc(s.note) + "</small>" : "") + "</th>" +
        '<td data-label="経験">' + esc(s.years) + "</td>" +
        '<td data-label="習熟度">' + pips + "</td>" +
        '<td data-label="使用した作品"><div class="skill-works">' + (works || '<span class="muted">—</span>') + "</div></td>" +
      "</tr>";
    }).join("");

    var items = [];
    items.push(SITE.github
      ? '<li><span class="contact-label">GitHub</span><a href="' + esc(SITE.github) + '" target="_blank" rel="noopener">' + esc(SITE.github.replace(/^https?:\/\//, "")) + "</a></li>"
      : '<li><span class="contact-label">GitHub</span><span class="muted">［GitHubのURLを data.js に入力］</span></li>');
    if (SITE.email) items.push('<li><span class="contact-label">メール</span><a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a></li>");
    (SITE.others || []).forEach(function (o) {
      items.push('<li><span class="contact-label">' + esc(o.label) + '</span><a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + esc(o.url.replace(/^https?:\/\//, "")) + "</a></li>");
    });
    var contact = document.getElementById("contact-list");
    if (contact) contact.innerHTML = items.join("");
  }

  /* ---------- AI Research: index and readable detail pages ---------- */
  function researchUrl(r) {
    return "ai-detail.html?id=" + encodeURIComponent(r.id);
  }
  function researchShortTitle(r) {
    return (r.title || "").split("｜")[0].split(" — ")[0];
  }
  function researchVisual(r, i) {
    var symbols = {"unity-mcp":"MCP","ai3d-launcher":"3D","memory-hub":"MD","gyro":"GYRO"};
    var hasImage = !!r.image;
    return '<div class="research-visual visual-' + esc(r.id) + '"' +
      (hasImage ? ' data-project-media' : ' aria-hidden="true"') + '>' +
      '<span class="research-visual-grid"></span><span class="visual-corner">0' + (i + 1) +
      ' / RESEARCH</span><span class="visual-mark">' + esc(symbols[r.id] || "AI") + "</span>" +
      (hasImage ? '<img class="research-preview-image" src="' + esc(r.image) +
        '" alt="' + esc(researchShortTitle(r)) + 'の操作画面" loading="lazy">' : "") + "</div>";
  }
  function researchChips(items, limit) {
    return '<div class="research-chip-list">' + (items || []).slice(0, limit || 4).map(function (item) {
      return "<span>" + esc(item) + "</span>";
    }).join("") + "</div>";
  }
  function researchCard(r, i, compact) {
    return '<article class="research-card' + (compact ? " compact" : "") + '">' +
      '<a class="research-card-link" href="' + researchUrl(r) + '">' +
        researchVisual(r, i) +
        '<div class="research-card-content"><h3>' + esc(researchShortTitle(r)) + "</h3>" +
          '<p>' + esc(r.summary) + '</p><div class="research-card-foot">' +
          researchChips(r.tools, compact ? 2 : 3) +
          '<span class="research-link-text">詳しく見る →</span></div>' +
        "</div></a></article>";
  }
  function researchList(items) {
    return '<ul class="code-list">' + (items || []).map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("") + "</ul>";
  }
  function renderAI() {
    var lead = document.getElementById("ai-lead");
    if (lead) lead.textContent = AI_INTRO;
    var grid = document.getElementById("research-grid");
    if (grid) grid.innerHTML = AI_RESEARCH.map(function (r, i) {
      return researchCard(r, i, false);
    }).join("");
  }
  function renderAIDetail() {
    var root = document.getElementById("research-detail");
    if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    var r = AI_RESEARCH.filter(function (item) { return item.id === id; })[0];
    if (!r) {
      root.innerHTML = '<div class="container not-found"><h1>研究テーマが見つかりません</h1>' +
        '<p><a class="btn" href="ai.html">AI Research一覧に戻る</a></p></div>';
      return;
    }
    var index = AI_RESEARCH.indexOf(r);
    var spotlight = {
      "unity-mcp":"Unity操作専用サービスの月間回数枠や追加クレジット消費に依存しない接続構成",
      "ai3d-launcher":"複数の生成AIを一つの画面にまとめ、品質を検証しながらゲーム素材を制作",
      "memory-hub":"ChatGPT・GitHub・Obsidianで、確定仕様と作業履歴を引き継げる仕組み",
      "gyro":"AIを実装支援に使い、2日間でスマホのセンサーを活用したゲームを試作"
    };
    document.title = researchShortTitle(r) + "｜AI Research｜ポートフォリオ";
    var links = (r.links || []).map(function (link) {
      return '<li><a class="btn btn-ghost" target="_blank" rel="noopener noreferrer" href="' +
        esc(link.url) + '">' + esc(link.label) + "</a></li>";
    }).join("");
    var prev = AI_RESEARCH[index - 1], next = AI_RESEARCH[index + 1];
    root.innerHTML =
      '<header class="research-detail-hero"><div class="container">' +
        '<nav class="breadcrumb" aria-label="現在地"><a href="index.html">Home</a>' +
        '<span>/</span><a href="ai.html">AI Research</a><span>/</span><span>' + esc(researchShortTitle(r)) + "</span></nav>" +
        '<span class="eyebrow" style="color:#afcef9">0' + (index + 1) + ' / AI RESEARCH</span>' +
        '<h1>' + esc(researchShortTitle(r)) + "</h1>" +
        '<p class="research-hero-summary">' + esc(r.summary) + "</p>" +
        researchChips(r.tools, 5) + "</div></header>" +
      '<div class="container">' +
        '<div class="research-focus"><span class="research-focus-label">この研究のポイント</span>' +
          '<h2>' + esc(spotlight[r.id] || r.summary) + "</h2></div>" +
        (r.image ? '<figure class="research-feature-media" data-project-media>' +
          '<div class="research-feature-fallback">研究成果の画面イメージは準備中です。</div>' +
          '<img class="research-feature-image" src="' + esc(r.image) +
          '" alt="' + esc(researchShortTitle(r)) + 'の実際の操作画面" loading="lazy">' +
          '<figcaption>' + esc(r.imageCaption || researchShortTitle(r) + "の実際の画面") +
          '</figcaption></figure>' : '') +
        '<div class="research-detail-layout"><div class="research-primary">' +
          '<section class="research-detail-section"><h2>開発の背景・目的</h2><p>' + esc(r.goal) + "</p></section>" +
          '<section class="research-detail-section"><h2>工夫した点・実装内容</h2>' +
            '<details class="research-details"><summary>技術的な取り組みを見る（' + (r.approach || []).length + '項目）</summary>' +
              researchList(r.approach) + "</details></section>" +
          '<section class="research-detail-section"><h2>結果と現在の課題</h2>' + researchList(r.results) + "</section>" +
          '<section class="research-detail-section"><h2>学んだこと</h2>' + researchList(r.learnings) + "</section>" +
        '</div><aside class="research-fact-card"><h2>Project Info</h2>' +
          '<dl><dt>制作・検証期間</dt><dd>' + esc(r.period) + '</dd>' +
          '<dt>現在の状態</dt><dd>' + esc(r.status || "検証中") + '</dd>' +
          '<dt>使用技術</dt><dd>' + researchChips(r.tools, 20) + '</dd></dl>' +
          (links ? '<ul class="link-list">' + links + "</ul>" : "") +
        '</aside></div>' +
        '<nav class="research-pager" aria-label="研究テーマの移動"><a href="ai.html">← AI Research一覧</a>' +
          (prev ? '<a href="' + researchUrl(prev) + '">' + esc(researchShortTitle(prev)) + " ←</a>" : "") +
          (next ? '<a href="' + researchUrl(next) + '">次の研究：' + esc(researchShortTitle(next)) + " →</a>" : "") +
        "</nav></div>";
  }

  renderHeader();
  renderFooter();
  if (page === "ai") renderAI();
  if (page === "ai-detail") renderAIDetail();
  if (page === "home") renderHome();
  if (page === "works") renderWorks();
  if (page === "work") renderWork();
  if (page === "home" || page === "skills") renderSkills();
  syncProjectMedia(document);
  reveal();
})();
