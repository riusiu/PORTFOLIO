/* デバッグメニュー風テーマの表示スクリプト。
   中身の編集は data.js（作品・ツール・プロフィール）と log.js（BUILD LOG）で行います。 */
(function () {
  "use strict";

  var page = document.body.dataset.page;
  var params = new URLSearchParams(location.search);
  var AI = typeof AI_RESEARCH !== "undefined" ? AI_RESEARCH : [];
  var PLAN = typeof PLANNING !== "undefined" ? PLANNING : [];
  var LOG = typeof BUILD_LOG !== "undefined" ? BUILD_LOG : [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function set(id, html) { var e = $(id); if (e) e.innerHTML = html; }
  function workUrl(w) { return "work.html?id=" + encodeURIComponent(w.id); }
  function toolUrl(a) { return "ai.html?id=" + encodeURIComponent(a.id); }
  function typeLabel(t) { return t === "solo" ? "個人制作" : t === "team" ? "チーム制作" : ""; }
  function shortType(t) { return t === "solo" ? "個人" : t === "team" ? "チーム" : ""; }
  function isFilled(s) { return s && String(s).indexOf("［") < 0; }
  function splitTitle(t) {
    var i = String(t).indexOf("｜");
    return i < 0 ? { name: t, tag: "" } : { name: t.slice(0, i), tag: t.slice(i + 1) };
  }
  function findWork(id) { return WORKS.filter(function (w) { return w.id === id; })[0]; }
  function findTool(id) { return AI.filter(function (a) { return a.id === id; })[0]; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- ヘッダー ---------- */
  function renderBar(scene, links) {
    var el = $("bar");
    if (!el) return;
    el.innerHTML =
      '<div class="bar-inner">' +
        '<div class="bar-left"><a class="brand" href="index.html">' + esc(SITE.name) + "</a>" +
        '<span class="scene">SCENE: ' + esc(scene) + "</span></div>" +
        '<nav class="bar-nav" aria-label="' + (links.toc ? "このページの目次" : "サイト内メニュー") + '">' +
          links.items.map(function (l) {
            return '<a href="' + esc(l.href) + '"' + (l.current ? ' aria-current="page"' : "") + ">" +
              (l.key ? '<span class="key">' + esc(l.key) + "</span>" : "") + esc(l.label) + "</a>";
          }).join("") +
        "</nav>" +
      "</div>";
  }
  function globalNav(current) {
    return { items: [
      { key: "F1", label: "PROGRAM", href: "works.html", current: current === "program" },
      { key: "F2", label: "TOOLS & AI", href: "ai.html", current: current === "tools" },
      { key: "F3", label: "STRENGTHS", href: "index.html#strengths" },
      { key: "F4", label: "LOG", href: "index.html#log" },
      { key: "F5", label: "PROFILE", href: "index.html#profile" }
    ] };
  }

  /* ---------- フッター ---------- */
  function renderFoot() {
    var items = ['<strong>CONTACT</strong>'];
    if (SITE.github) items.push('<a href="' + esc(SITE.github) + '" target="_blank" rel="noopener">' + esc(SITE.github.replace(/^https?:\/\//, "")) + "</a>");
    if (SITE.email) items.push('<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>");
    (SITE.others || []).forEach(function (o) {
      items.push('<a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + esc(o.label) + "</a>");
    });
    set("foot", '<div class="foot-inner" id="contact">' + items.join("") + "</div>");
  }

  /* ---------- PROGRAM：シーンセレクト ---------- */
  function renderProgram() {
    var list = $("scene-list"), ins = $("inspector");
    if (!list || !ins) return;
    list.innerHTML = WORKS.map(function (w, i) {
      return '<button type="button" class="scene-btn" data-i="' + i + '" aria-pressed="' + (i === 0) + '" aria-controls="inspector">' +
        '<span class="s-text"><span class="s-title">' + esc(w.title) + "</span>" +
        '<span class="s-sub">' + esc(w.subtitle) + "</span></span>" +
        '<span class="s-type">' + esc(shortType(w.type)) + "</span></button>";
    }).join("");
    function show(i) {
      var w = WORKS[i];
      Array.prototype.forEach.call(list.querySelectorAll(".scene-btn"), function (b) {
        b.setAttribute("aria-pressed", String(Number(b.dataset.i) === i));
      });
      ins.innerHTML =
        '<div class="panel-head"><strong>INSPECTOR</strong><span class="muted">' + esc(w.id) + "</span></div>" +
        '<div class="inspector-body">' +
          (w.thumbnail ? '<img class="inspector-media" src="' + esc(w.thumbnail) + '" alt="' + esc(w.title) + 'のゲーム画面">' : "") +
          '<div class="i-title"><h3>' + esc(w.title) + "</h3>" +
            (typeLabel(w.type) ? '<span class="tag tag-accent">' + typeLabel(w.type) + "</span>" : "") +
            (w.status ? '<span class="tag">' + esc(w.status) + "</span>" : "") + "</div>" +
          '<p class="jp">' + esc(w.summary) + "</p>" +
          gameInfo(w) +
          '<a class="btn" href="' + workUrl(w) + '" style="align-self:flex-start">詳細ページを開く →</a>' +
        "</div>";
    }
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".scene-btn");
      if (b) show(Number(b.dataset.i));
    });
    show(0);
  }
  function gameInfo(w) {
    return '<div class="component"><div class="component-head">▼ GameInfo (Component)</div><dl class="fields">' +
      "<dt>開発環境</dt><dd>" + esc(w.engine) + "</dd>" +
      "<dt>制作人数</dt><dd>" + esc(w.teamSize) + "</dd>" +
      "<dt>制作期間</dt><dd>" + esc(w.period) + "</dd>" +
      "<dt>担当</dt><dd>" + esc(w.role) + "</dd>" +
    "</dl></div>";
  }

  /* ---------- TOOLS & AI の一覧 ---------- */
  function toolCards() {
    return AI.map(function (a, i) {
      var t = splitTitle(a.title);
      return '<article class="panel tool-card">' +
        '<div class="tool-meta"><span class="muted">TOOL_' + pad(i + 1) + " / " + esc(a.id) + '</span><span class="status">● ' + esc(a.status) + "</span></div>" +
        "<h3>" + esc(t.name) + "</h3>" +
        (t.tag ? '<div class="tool-tagline">' + esc(t.tag) + "</div>" : "") +
        "<p>" + esc(a.summary) + "</p>" +
        ((a.tools || []).length ? '<div class="stack">STACK: ' + esc(a.tools.slice(0, 4).join(" / ")) + "</div>" : "") +
        '<a class="more" href="' + toolUrl(a) + '">詳細を開く →</a>' +
      "</article>";
    }).join("");
  }

  /* ---------- トップページ ---------- */
  function renderHome() {
    var unity = (typeof SKILLS !== "undefined" ? SKILLS : []).filter(function (s) { return s.name === "Unity"; })[0];
    // Keep the name, role and full school name as separate wrapping units.
    // The school moves to the next row intact instead of breaking mid-name.
    var schoolName = SITE.schoolUrl
      ? '<a href="' + esc(SITE.schoolUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(SITE.school) + "</a>"
      : esc(SITE.school);
    set("hero-who",
      '<strong class="hero-who-name">' + esc(SITE.name) + "</strong>" +
      '<span class="hero-who-role">' + esc(SITE.role) + "志望</span>" +
      '<span class="hero-who-school">' + schoolName + "</span>");
    set("stats",
      "<div><dt>PROGRAM</dt><dd>" + WORKS.length + "</dd></div>" +
      "<div><dt>TOOLS &amp; AI</dt><dd>" + AI.length + "</dd></div>" +
      (unity && isFilled(unity.years) ? "<div><dt>UNITY / C#</dt><dd>" + esc(unity.years) + "</dd></div>" : ""));
    set("m-program", String(WORKS.length));
    set("m-tools", String(AI.length));
    set("m-plan", String(PLAN.length));

    /* 実機プレイ：動画のある作品を順番に再生 */
    var clips = WORKS.filter(function (w) { return w.localVideo; });
    var pv = $("preview-sec");
    if (pv && clips.length) {
      pv.hidden = false;
      var video = $("preview-video"), label = $("preview-label"), idx = 0;
      function play(i) {
        var w = clips[i];
        video.src = w.localVideo;
        if (w.thumbnail) video.poster = w.thumbnail;
        label.innerHTML = '<a href="' + workUrl(w) + '">' + esc(w.title) + "</a>";
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
      video.addEventListener("ended", function () { idx = (idx + 1) % clips.length; play(idx); });
      video.addEventListener("error", function () { if (clips.length > 1) { idx = (idx + 1) % clips.length; play(idx); } });
      play(0);
    }

    renderProgram();
    set("tool-grid", toolCards());

    set("config", (SITE.philosophy || []).map(function (p, i) {
      return '<div class="panel config-item"><span class="c-key">CONFIG_' + pad(i + 1) + "</span><h3>" + esc(p.title) + "</h3><p>" + esc(p.body) + "</p></div>";
    }).join(""));
    set("plan", PLAN.map(function (p) {
      var href = p.workId && findWork(p.workId) ? workUrl(findWork(p.workId)) : (p.link || "");
      return '<div class="plan-row"><span class="p-title">' + (href ? '<a href="' + esc(href) + '">' + esc(p.title) + "</a>" : esc(p.title)) +
        '</span><span class="p-role">' + esc(p.role) + '</span><span class="p-body">' + esc(p.body) + "</span></div>";
    }).join(""));

    set("log-list", LOG.map(function (l) {
      return '<div class="log-line"><span class="log-date">[' + esc(l.date) + ']</span><span class="log-tag ' + (l.type === "a" ? "a" : "") + '">' + esc(l.tag) + '</span><span class="log-text">' + esc(l.text) + "</span></div>";
    }).join("") + '<div class="cursor">&gt; _</div>');

    var rows = [["名前", esc(SITE.name)],
      ["学校", SITE.schoolUrl ? '<a href="' + esc(SITE.schoolUrl) + '" target="_blank" rel="noopener">' + esc(SITE.school) + "</a>" : esc(SITE.school)],
      ["学科・専攻", esc(SITE.department)], ["卒業", esc(SITE.graduation)], ["志望職種", esc(SITE.role)], ["好きなジャンル", esc(SITE.favoriteGenres)]];
    set("profile-fields", rows.filter(function (r) { return isFilled(r[1]); }).map(function (r) {
      return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>";
    }).join(""));
    set("intro", (SITE.intro || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""));
    set("skills", (typeof SKILLS !== "undefined" ? SKILLS : []).map(function (s) {
      return '<div class="skill-row"><span class="k">' + esc(s.name) + '</span><span class="v">' + esc(s.years) + "</span>" +
        (s.note ? '<span class="n">' + esc(s.note) + "</span>" : "") + "</div>";
    }).join(""));
  }

  /* ---------- 作品詳細 ---------- */
  function renderWork(root) {
    var w = findWork(params.get("id")) || WORKS[0];
    if (!w) return;
    document.title = w.title + "｜" + SITE.name;
    var secs = [], html = "";
    function sec(id, title, body) { secs.push({ id: id, title: title }); html += '<section class="d-sec" id="' + id + '"><h2>' + title + "</h2>" + body + "</section>"; }

    var media = w.localVideo
      ? '<video class="d-media" controls muted playsinline preload="metadata"' + (w.thumbnail ? ' poster="' + esc(w.thumbnail) + '"' : "") + '><source src="' + esc(w.localVideo) + '" type="video/mp4"></video>'
      : (w.youtube ? '<iframe class="d-media" src="https://www.youtube-nocookie.com/embed/' + esc(w.youtube) + '" title="' + esc(w.title) + 'のプレイ動画" allowfullscreen loading="lazy" style="border:0"></iframe>'
      : (w.thumbnail ? '<img class="d-media" src="' + esc(w.thumbnail) + '" alt="' + esc(w.title) + 'のゲーム画面">' : ""));
    var links = (w.links || []).map(function (l) { return '<a class="btn" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("");

    var top =
      '<div class="crumb"><a href="works.html">PROGRAM</a> / ' + esc(w.title) + "</div>" +
      '<div class="d-hero"><div class="d-main">' +
        '<div class="d-tags">' + (typeLabel(w.type) ? '<span class="tag tag-accent">' + typeLabel(w.type) + "</span>" : "") + (w.status ? '<span class="tag">' + esc(w.status) + "</span>" : "") + "</div>" +
        "<h1>" + esc(w.title) + "</h1>" +
        (w.subtitle ? '<p class="d-sub">' + esc(w.subtitle) + "</p>" : "") +
        (w.summary ? '<p class="d-lead">' + esc(w.summary) + "</p>" : "") + media +
      '</div><aside class="panel d-side"><div class="panel-head"><strong>INSPECTOR</strong><span class="muted">' + esc(w.id) + "</span></div>" +
        '<div style="padding:14px 14px 4px">' + gameInfo(w) + "</div>" + (links ? '<div class="d-links" style="padding-top:12px">' + links + "</div>" : '<div style="height:10px"></div>') +
      "</aside></div>";

    if ((w.description || []).length) sec("overview", "概要", '<div class="prose">' + w.description.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>");
    if ((w.versions || []).length) sec("versions", esc(w.versionsTitle || "初代とリメイク"), '<div class="versions">' + w.versions.map(function (v) {
      return '<div class="panel version"><div class="panel-head"><strong>' + esc(v.label) + "</strong></div>" +
        '<dl class="fields"><dt>制作人数</dt><dd>' + esc(v.teamSize) + "</dd><dt>開発環境</dt><dd>" + esc(v.engine) + "</dd><dt>状況</dt><dd>" + esc(v.context) + "</dd></dl>" +
        ((v.points || []).length ? '<ul class="checks">' + v.points.map(function (p) { return '<li><span class="mark">[x]</span><span>' + esc(p) + "</span></li>"; }).join("") + "</ul>" : "") + "</div>";
    }).join("") + "</div>");
    if ((w.myCode || []).length) sec("mycode", "担当したプログラム", '<ul class="checks">' + w.myCode.map(function (c) { return '<li><span class="mark">[x]</span><span>' + esc(c) + "</span></li>"; }).join("") + "</ul>");
    if ((w.code || []).length) {
      var tabs = w.code.map(function (c, i) {
        return '<button type="button" class="code-tab" role="tab" id="tab-' + i + '" aria-controls="panel-' + i + '" aria-selected="' + (i === 0) + '">' + esc(c.file || c.title || ("CODE " + (i + 1))) + "</button>";
      }).join("");
      var panels = w.code.map(function (c, i) {
        return '<div class="code-panel' + (i === 0 ? " is-on" : "") + '" role="tabpanel" id="panel-' + i + '" aria-labelledby="tab-' + i + '">' +
          ((c.title || c.note) ? '<p class="code-note">' + esc(c.title) + (c.title && c.note ? "：" : "") + esc(c.note) + "</p>" : "") +
          "<pre><code>" + esc(c.body) + "</code></pre></div>";
      }).join("");
      sec("code", "コード", '<div class="code"><div class="code-tabs" role="tablist">' + tabs + "</div>" + panels + "</div>");
    }
    var ideas = (w.ideas || []).filter(function (i) { return isFilled(i.title) || isFilled(i.body); });
    if (ideas.length) sec("ideas", "工夫した点", '<div class="ideas">' + ideas.map(function (i) { return '<div class="panel idea"><h3>' + esc(i.title) + "</h3><p>" + esc(i.body) + "</p></div>"; }).join("") + "</div>");
    var probs = (w.problems || []).filter(function (p) { return isFilled(p.problem) || isFilled(p.solution); });
    if (probs.length) sec("issue", "発生した問題と解決方法", probs.map(function (p, i) {
      return '<article class="panel issue"><div class="panel-head"><strong>ISSUE #' + (i + 1) + '</strong><span class="resolved">● RESOLVED</span></div>' +
        '<div class="issue-body"><div class="issue-col"><div class="issue-label">PROBLEM</div><p>' + esc(p.problem) + '</p></div><div class="issue-col"><div class="issue-label">FIX</div><p>' + esc(p.solution) + "</p></div></div></article>";
    }).join(""));
    if ((w.screenshots || []).length) sec("shots", "スクリーンショット", '<div class="shots">' + w.screenshots.map(function (s, i) { return '<a href="' + esc(s) + '" target="_blank" rel="noopener"><img src="' + esc(s) + '" alt="' + esc(w.title) + "のスクリーンショット" + (i + 1) + '" loading="lazy"></a>'; }).join("") + "</div>");

    var idx = WORKS.indexOf(w), prev = WORKS[idx - 1], next = WORKS[idx + 1];
    var pager = '<nav class="pager" aria-label="ほかの作品">' +
      (prev ? '<a href="' + workUrl(prev) + '"><small>← 前の作品</small>' + esc(prev.title) + "</a>" : '<a href="works.html"><small>←</small>PROGRAM一覧</a>') +
      (next ? '<a href="' + workUrl(next) + '" style="text-align:right"><small>次の作品 →</small>' + esc(next.title) + "</a>" : '<a href="works.html" style="text-align:right"><small>→</small>PROGRAM一覧</a>') + "</nav>";

    root.innerHTML = top + html + pager;
    renderBar("Program_" + w.id, { toc: true, items: secs.map(function (s) { return { label: s.title.replace(/<[^>]+>/g, ""), href: "#" + s.id }; }) });

    var tabsEl = root.querySelector(".code-tabs");
    if (tabsEl) tabsEl.addEventListener("click", function (e) {
      var t = e.target.closest(".code-tab"); if (!t) return;
      Array.prototype.forEach.call(root.querySelectorAll(".code-tab"), function (x) { x.setAttribute("aria-selected", String(x === t)); });
      Array.prototype.forEach.call(root.querySelectorAll(".code-panel"), function (p) { p.classList.toggle("is-on", p.id === t.getAttribute("aria-controls")); });
    });
  }

  /* ---------- ツール詳細 ---------- */
  function renderTool(root, a) {
    var t = splitTitle(a.title), i = AI.indexOf(a);
    document.title = t.name + "｜" + SITE.name;
    var secs = [], html = "";
    function sec(id, title, body) { secs.push({ id: id, title: title }); html += '<section class="d-sec" id="' + id + '"><h2>' + title + "</h2>" + body + "</section>"; }
    var links = (a.links || []).map(function (l) { return '<a class="btn" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("");

    var top =
      '<div class="crumb"><a href="ai.html">TOOLS &amp; AI</a> / ' + esc(t.name) + "</div>" +
      '<div class="d-hero"><div class="d-main">' +
        '<div class="d-tags"><span class="muted">TOOL_' + pad(i + 1) + " / " + esc(a.id) + '</span><span class="resolved">● ' + esc(a.status) + "</span></div>" +
        "<h1>" + esc(t.name) + "</h1>" +
        (t.tag ? '<p class="d-tagline">' + esc(t.tag) + "</p>" : "") +
        '<p class="d-lead">' + esc(a.summary) + "</p>" +
      '</div><aside class="panel d-side"><div class="panel-head"><strong>BUILD INFO</strong></div>' +
        '<dl class="fields" style="padding:12px 18px 16px">' +
          (a.period ? "<dt>期間</dt><dd>" + esc(a.period) + "</dd>" : "") +
          ((a.tools || []).length ? '<dt>STACK</dt><dd><div class="chips">' + a.tools.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div></dd>" : "") +
        "</dl>" + (links ? '<div class="d-links">' + links + "</div>" : "") +
      "</aside></div>";

    if (a.image) html += '<section class="d-sec"><figure class="figure"><img src="' + esc(a.image) + '" alt="' + esc(a.imageCaption || t.name) + '">' + (a.imageCaption ? "<figcaption>" + esc(a.imageCaption) + "</figcaption>" : "") + "</figure></section>";
    if (a.demoUrl) sec("demo", "デモ", '<div class="demo">' + (a.qrImage ? '<img src="' + esc(a.qrImage) + '" alt="デモページのQRコード">' : "") +
      '<div style="display:flex;flex-direction:column;gap:10px"><p class="jp">スマホで読み取るか、ボタンから開けます。</p><a class="btn" href="' + esc(a.demoUrl) + '" target="_blank" rel="noopener">デモを開く →</a></div></div>');
    if (a.goal) sec("goal", "目的", '<div class="prose"><p>' + esc(a.goal) + "</p></div>");
    if ((a.approach || []).length) sec("steps", "やったこと", '<ol class="steps">' + a.approach.map(function (s, n) { return '<li><span class="no">' + pad(n + 1) + "</span><span>" + esc(s) + "</span></li>"; }).join("") + "</ol>");
    if ((a.results || []).length) sec("result", "結果", '<ul class="checks">' + a.results.map(function (r) {
      var note = /^※/.test(r);
      return '<li><span class="mark' + (note ? " note" : "") + '">' + (note ? "[NOTE]" : "[OK]") + "</span><span>" + esc(r.replace(/^※\s*/, "")) + "</span></li>";
    }).join("") + "</ul>");
    if ((a.learnings || []).length) sec("learn", "学んだこと", '<div class="prose">' + a.learnings.map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") + "</div>");

    var prev = AI[i - 1], next = AI[i + 1];
    var pager = '<nav class="pager" aria-label="ほかのツール">' +
      (prev ? '<a href="' + toolUrl(prev) + '"><small>← 前のツール</small>' + esc(splitTitle(prev.title).name) + "</a>" : '<a href="ai.html"><small>←</small>TOOLS &amp; AI一覧</a>') +
      (next ? '<a href="' + toolUrl(next) + '" style="text-align:right"><small>次のツール →</small>' + esc(splitTitle(next.title).name) + "</a>" : '<a href="ai.html" style="text-align:right"><small>→</small>TOOLS &amp; AI一覧</a>') + "</nav>";

    root.innerHTML = top + html + pager;
    renderBar("Tool_" + a.id, { toc: true, items: secs.map(function (s) { return { label: s.title, href: "#" + s.id }; }) });
  }

  /* ---------- サイト内ショートカット ---------- */
  function setupGlobalShortcuts() {
    var routes = {
      "1": "works.html",
      "2": "ai.html",
      "3": "index.html#strengths",
      "4": "index.html#log",
      "5": "index.html#profile"
    };
    document.addEventListener("keydown", function (event) {
      if (event.defaultPrevented || event.repeat ||
          event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
      var active = document.activeElement;
      if (active && (active.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName))) return;
      var key = /^F[1-5]$/.test(event.key) ? event.key.slice(1) :
        /^[1-5]$/.test(event.key) ? event.key : "";
      if (!key) return;
      var route = routes[key];
      if (!route) return;
      event.preventDefault();
      window.location.assign(route);
    });
  }

  /* ---------- 起動 ---------- */
  if (page === "home") { renderBar("Portfolio_Main", globalNav("")); renderHome(); }
  if (page === "works") { renderBar("Program_List", globalNav("program")); renderProgram(); }
  if (page === "work") { renderWork($("detail")); }
  if (page === "ai") {
    var tool = findTool(params.get("id"));
    if (tool) { var lst = $("list"); if (lst) lst.hidden = true; renderTool($("detail"), tool); }
    else { renderBar("Tools_List", globalNav("tools")); set("tool-grid", toolCards()); var d = $("detail"); if (d) d.hidden = true; }
  }
  renderFoot();
  setupGlobalShortcuts();
})();
