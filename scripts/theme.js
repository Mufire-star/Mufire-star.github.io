// =============================================
// theme.js — 博客主题切换（暗色/亮色）
// 支持：localStorage 持久化、跟随系统偏好
// =============================================
(function () {
  'use strict';

  var STORAGE_KEY = 'preferred-theme';
  var ROOT = document.documentElement;
  var MEDIA = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    ROOT.dataset.theme = theme;
  }

  function resolveInitial() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return MEDIA.matches ? 'dark' : 'light';
  }

  // 初始化
  applyTheme(resolveInitial());

  // 监听系统主题变化（仅在用户未手动设置时）
  MEDIA.addEventListener('change', function (e) {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return;
    applyTheme(e.matches ? 'dark' : 'light');
  });

  // 暴露全局切换函数
  window.toggleTheme = function () {
    var next = ROOT.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);

    // 更新所有切换按钮的图标
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = next === 'dark' ? '🌙' : '☀️';
    }
  };

  // DOM 加载完成后，给所有切换按钮设置正确的图标
  document.addEventListener('DOMContentLoaded', function () {
    var current = ROOT.dataset.theme || 'light';
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = current === 'dark' ? '🌙' : '☀️';
    }
  });
})();
