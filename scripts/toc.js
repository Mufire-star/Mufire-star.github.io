// =============================================
// toc.js — 自动生成目录 + 滚动高亮
// 修复：同名标题不会同时高亮
// =============================================
(function() {
  'use strict';

  function setupToc() {
    var sidebar = document.querySelector('.sidebar-card .toc-nav');
    var article = document.querySelector('.article-body');
    if (!sidebar || !article) return;

    // 扫描 h2 和 h3
    var headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      sidebar.innerHTML = '<p class="toc-empty">暂无目录</p>';
      return;
    }

    // 确保每个标题都有唯一 id
    var seenIds = {};
    var tocItems = [];
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      var tag = h.tagName.toLowerCase();
      if (!h.id) {
        h.id = 'section-' + (i + 1);
      }
      // 防止重复 id
      if (seenIds[h.id]) {
        h.id = h.id + '-' + i;
      }
      seenIds[h.id] = true;

      tocItems.push({
        id: h.id,
        text: h.textContent.trim(),
        level: tag === 'h3' ? 3 : 2,
        el: h
      });
    }

    // 生成 TOC HTML
    var html = '<div class="toc-list">';
    for (var j = 0; j < tocItems.length; j++) {
      var item = tocItems[j];
      var cls = 'toc-link toc-h' + item.level;
      html += '<div class="toc-item"><a class="' + cls + '" href="#' + item.id + '">'
            + escapeHtml(item.text) + '</a></div>';
    }
    html += '</div>';
    sidebar.innerHTML = html;

    // 保存 links 和 headings 的对应关系
    var links = sidebar.querySelectorAll('.toc-link');
    var linkMap = {};
    for (var k = 0; k < links.length; k++) {
      var href = links[k].getAttribute('href') || '';
      linkMap[href.slice(1)] = links[k];
    }

    // 当前活跃的 id
    var activeId = null;

    function setActive(id) {
      if (id === activeId) return;  // 已经高亮着，跳过
      // 移除旧的
      if (activeId && linkMap[activeId]) {
        linkMap[activeId].classList.remove('is-active');
      }
      // 高亮新的
      if (id && linkMap[id]) {
        linkMap[id].classList.add('is-active');
      }
      activeId = id;
    }

    // 找到最靠近视口顶部的那一个标题
    function findClosestToTop(entries) {
      var best = null;
      var bestDist = Infinity;
      for (var m = 0; m < entries.length; m++) {
        if (!entries[m].isIntersecting) continue;
        var rect = entries[m].target.getBoundingClientRect();
        var dist = Math.abs(rect.top - window.innerHeight * 0.2);
        if (dist < bestDist) {
          bestDist = dist;
          best = entries[m].target.id;
        }
      }
      return best;
    }

    var observer = new IntersectionObserver(function(entries) {
      var id = findClosestToTop(entries);
      if (id) setActive(id);
    }, {
      rootMargin: '-15% 0px -65% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    });

    for (var n = 0; n < headings.length; n++) {
      observer.observe(headings[n]);
    }

    // 初始化第一个
    if (tocItems.length > 0) {
      setActive(tocItems[0].id);
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToc);
  } else {
    setupToc();
  }

})();
