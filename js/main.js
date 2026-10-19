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

  /* ---------- 共通：ヘッダー ---------- */
  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;
    var sub = WORKS.map(function (w) {
      return '<li><a href="' + workUrl(w) + '">' + esc(w.title) + "</a></li>";
    }).join("");
    el.innerHTML =
      '<div class="header-inner">' +
        '<a class="logo" href="index.html">' + esc(SITE.nameEn || SITE.name) + "</a>" +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="global-nav">' +
          '<span class="menu-bars" aria-hidden="true"></span><span class="menu-text">メニュー</span></button>' +
        '<nav id="global-nav" class="global-nav" aria-label="サイト内メニュー"><ul class="nav-list">' +
          '<li><a href="index.html"' + cur(page === "home") + ">Home / About</a></li>" +
          '<li class="has-sub"><a href="works.html"' + cur(page === "works" || page === "work") + ">Works</a>" +
            '<ul class="sub-list">' + sub + "</ul></li>" +
          '<li><a href="ai.html"' + cur(page === "ai") + ">AI Research</a></li>" +
          '<li><a href="skills.html"' + cur(page === "skills") + ">Skills / Contact</a></li>" +
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
          '<li><a href="skills.html">Skills / Contact</a></li>' +
        "</ul>" +
        '<p class="footer-copy">&copy; ' + new Date().getFullYear() + " " + esc(SITE.name) + "</p>" +
      "</div>";
  }

  /* ---------- 作品カード ---------- */
  function thumb(w, cls) {
    if (w.thumbnail) {
      return '<img class="' + cls + '" src="' + esc(w.thumbnail) + '" alt="' + esc(w.title) + 'の画面" loading="lazy">';
    }
    return '<div class="' + cls + ' thumb-empty" aria-hidden="true"><span>' + esc(w.title) + "</span></div>";
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
    return '<article class="work-card">' +
      '<a class="work-card-link" href="' + workUrl(w) + '">' +
        '<div class="work-card-media">' + thumb(w, "work-card-img") +
          '<span class="tag tag-' + esc(w.type) + '">' + typeLabel(w.type) + "</span></div>" +
        '<div class="work-card-body">' +
          '<h3 class="work-card-title">' + esc(w.title) + "</h3>" +
          (w.subtitle ? '<p class="work-card-sub">' + esc(w.subtitle) + "</p>" : "") +
          specList(w, "spec") +
          '<span class="work-card-more">詳細を見る</span>' +
        "</div>" +
      "</a></article>";
  }

  /* ---------- HOME / ABOUT ---------- */
  function renderHome() {
    var set = function (id, html) { var e = document.getElementById(id); if (e) e.innerHTML = html; };
    set("hero-name", esc(SITE.name));
    set("hero-role", esc(SITE.role) + "志望");
    set("hero-catch", esc(SITE.catchphrase));
    set("hero-school", esc(SITE.school) + "　" + esc(SITE.department));

    var src = (SITE.nameEn && SITE.nameEn !== "PORTFOLIO" ? SITE.nameEn : SITE.name).replace(/［[^］]*］/g, "").trim();
    var initial = src.charAt(0);
    set("profile-photo", SITE.photo
      ? '<img src="' + esc(SITE.photo) + '" alt="' + esc(SITE.name) + 'の写真">'
      : '<span class="photo-initial" aria-hidden="true">' + esc(initial) + "</span>");

    var rows = [
      ["名前", SITE.name], ["学校", SITE.school], ["学科・専攻", SITE.department],
      ["卒業", SITE.graduation], ["志望職種", SITE.role], ["好きなジャンル", SITE.favoriteGenres]
    ];
    set("profile-table", rows.map(function (r) {
      return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
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
  }

  /* ---------- SKILLS / CONTACT ---------- */
  function renderSkills() {
    var body = document.getElementById("skills-body");
    body.innerHTML = SKILLS.map(function (s) {
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
    items.push(SITE.email
      ? '<li><span class="contact-label">メール</span><a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a></li>"
      : '<li><span class="contact-label">メール</span><span class="muted">［メールアドレスを data.js に入力］</span></li>');
    (SITE.others || []).forEach(function (o) {
      items.push('<li><span class="contact-label">' + esc(o.label) + '</span><a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + esc(o.url.replace(/^https?:\/\//, "")) + "</a></li>");
    });
    document.getElementById("contact-list").innerHTML = items.join("");
  }

  /* ---------- AI研究 ---------- */
  function list(items, cls) {
    return '<ul class="' + cls + '">' + (items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }
  function renderAI() {
    var lead = document.getElementById("ai-lead");
    if (lead) lead.textContent = AI_INTRO;
    var toc = document.getElementById("ai-toc");
    toc.innerHTML = AI_RESEARCH.map(function (r) {
      return '<li><a href="#' + esc(r.id) + '">' + esc(r.title) + "</a></li>";
    }).join("");
    document.getElementById("ai-list").innerHTML = AI_RESEARCH.map(function (r) {
      var links = (r.links || []).length
        ? '<ul class="link-list">' + r.links.map(function (l) {
            return '<li><a class="btn btn-ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a></li>";
          }).join("") + "</ul>" : "";
      return '<article class="ai-entry" id="' + esc(r.id) + '">' +
        '<aside class="ai-meta">' +
          (r.status ? '<span class="tag tag-status">' + esc(r.status) + "</span>" : "") +
          '<dl class="spec">' +
            "<div><dt>期間</dt><dd>" + esc(r.period) + "</dd></div>" +
            "<div><dt>使用技術</dt><dd><div class=\"chips\">" + (r.tools || []).map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div></dd></div>" +
          "</dl>" + links +
        "</aside>" +
        '<div class="ai-body">' +
          '<h2 class="ai-title">' + esc(r.title) + "</h2>" +
          '<p class="ai-summary">' + esc(r.summary) + "</p>" +
          '<div class="ai-block"><h3>目的</h3><p>' + esc(r.goal) + "</p></div>" +
          '<div class="ai-block"><h3>やったこと</h3>' + list(r.approach, "code-list") + "</div>" +
          '<div class="ai-block"><h3>結果</h3>' + list(r.results, "code-list") + "</div>" +
          '<div class="ai-block"><h3>学んだこと</h3>' + list(r.learnings, "code-list") + "</div>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  renderHeader();
  renderFooter();
  if (page === "ai") renderAI();
  if (page === "home") renderHome();
  if (page === "works") renderWorks();
  if (page === "work") renderWork();
  if (page === "skills") renderSkills();
})();
