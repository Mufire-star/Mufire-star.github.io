// =============================================
// toc.js — <ol class="toc-list"> + level-N + 文章标题作为 level-1
// =============================================
(function() {
  'use strict';

  function setupToc() {
    var nav = document.querySelector('.sidebar-card .toc-nav');
    var body = document.querySelector('.article-body');
    if (!nav || !body) return;

    // Auto-detect article title: first h1 in article-body, or page h1
    var title = '';
    var titleEl = body.querySelector('h1') || document.querySelector('.article-header h1') || document.querySelector('h1');
    if (titleEl) {
      title = titleEl.textContent.trim();
    }

    var headings = body.querySelectorAll('h2, h3');
    
    if (!title && headings.length === 0) {
      nav.innerHTML = '<p class="toc-empty">暂无目录</p>';
      return;
    }

    // Build items: title → level-1, h2 → level-2, h3 → level-3
    var items = [];
    var seen = {};
    
    if (title) {
      items.push({ id: 'top', text: title, level: 1, el: null });
    }
    
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (h.getAttribute('data-toc') === 'skip') continue;
      var tag = h.tagName.toLowerCase();
      if (!h.id) { h.id = 'section-' + (i + 1); }
      if (seen[h.id]) { h.id = h.id + '-' + i; }
      seen[h.id] = true;
      items.push({
        id: h.id,
        text: h.textContent.trim(),
        level: tag === 'h3' ? 3 : 2,
        el: h
      });
    }

    // Generate HTML: 111-file structure
    var html = '<ol class="toc-list">';
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var href = item.id === 'top' ? '#top' : '#' + item.id;
      html += '<li class="toc-item toc-level-' + item.level + '">'
            + '<a href="' + href + '" class="toc-link">' + esc(item.text) + '</a></li>';
    }
    html += '</ol>';
    nav.innerHTML = html;

    // Active tracking
    var links = nav.querySelectorAll('.toc-link');
    var linkMap = {};
    var headingMap = {};
    
    for (var k = 0; k < items.length; k++) {
      if (items[k].el) headingMap[items[k].id] = items[k].el;
    }
    for (var k = 0; k < links.length; k++) {
      linkMap[(links[k].getAttribute('href') || '').slice(1)] = links[k];
    }

    var activeId = null;
    function setActive(id) {
      if (id === activeId) return;
      if (activeId && linkMap[activeId]) linkMap[activeId].classList.remove('is-active');
      if (id && linkMap[id]) linkMap[id].classList.add('is-active');
      activeId = id;
    }

    var observer = new IntersectionObserver(function(entries) {
      var best = null, bestD = Infinity;
      for (var m = 0; m < entries.length; m++) {
        if (!entries[m].isIntersecting) continue;
        var d = Math.abs(entries[m].target.getBoundingClientRect().top - window.innerHeight * 0.2);
        if (d < bestD) { bestD = d; best = entries[m].target.id; }
      }
      if (best) setActive(best);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] });

    for (var n = 0; n < headings.length; n++) {
      if (headings[n].getAttribute('data-toc') !== 'skip') observer.observe(headings[n]);
    }

    // Default: highlight title
    if (items.length > 0) setActive(items[0].id);
  }

  function esc(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }

  // Click title → scroll to top
  document.addEventListener('click', function(e) {
    var a = e.target.closest('.toc-level-1 > a');
    if (a && a.getAttribute('href') === '#top') {
      e.preventDefault();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToc);
  } else {
    setupToc();
  }
})();
