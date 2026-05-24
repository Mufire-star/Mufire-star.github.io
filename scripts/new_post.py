#!/usr/bin/env python3
"""
Mufire-star.github.io — 文章生成器

用法:
  python scripts/new_post.py "文章标题" --slug 文件名 --category 分类 --tags 标签1,标签2

示例:
  python scripts/new_post.py "Vitis HLS 优化技巧" --slug vitis-optimization --category 硬件加速 --tags HLS,Vitis,优化

生成的 HTML 文件在 src/ 目录下，并自动更新 index.html / tags / categories。
需要手动执行: 先运行脚本 -> 编辑内容 -> 提交
"""

import os
import sys
import json
import re
from datetime import date

POSTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src")

TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} · Mufire-star</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="viewport">
    <header class="site-header">
      <a href="../index.html" class="site-logo">Mufire<span class="dot">.</span>star</a>
      <nav class="main-nav">
        <a href="../index.html" class="nav-link">首页</a>
        <a href="../tags/index.html" class="nav-link">标签</a>
        <a href="../categories/index.html" class="nav-link">分类</a>
        <a href="../about/index.html" class="nav-link">关于</a>
      </nav>
    </header>

    <p class="breadcrumb"><a href="../index.html">首页</a> / <a href="../categories/index.html#category-{category}">{category_name}</a> / {title}</p>

    <div class="main-grid">
      <main class="main-content">
        <article>
          <header class="article-header">
            <div class="article-meta">
              <span class="meta-pill meta-date">{date}</span>
              <a href="../categories/index.html#category-{category}" class="meta-pill">{category_name}</a>
{tag_pills}
            </div>
            <h1>{title}</h1>
          </header>

          <div class="article-body">
{content_placeholder}
          </div>

          <nav class="article-pager">
            <a class="pager-link" href="../index.html">回到首页</a>
          </nav>
        </article>
      </main>

      <aside class="sidebar">
        <div class="sidebar-card">
          <h2 class="sidebar-title">目录</h2>
          <p style="color:var(--ink-faint);font-size:0.82rem;">滚动阅读</p>
        </div>
      </aside>
    </div>

    <footer class="site-footer">
      <div class="site-footer-inner">
        <span>&copy; {year} Mufire-star</span>
        <span>Powered by GitHub Pages</span>
      </div>
    </footer>
  </div>
</body>
</html>
'''

CONTENT_PLACEHOLDER = '''<!-- 在此处编写文章内容 -->
    <p>开始写你的文章吧 (ฅ^u u^ฅ)</p>
    <h2>第一节</h2>
    <p>正文内容...</p>
    <h2>第二节</h2>
    <p>正文内容...</p>'''

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\u4e00-\u9fff\-]', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def parse_args():
    args = sys.argv[1:]
    if not args or args[0] in ('-h', '--help'):
        print(__doc__)
        sys.exit(0)

    title = args[0]
    slug = None
    category = "未分类"
    tags = []

    i = 1
    while i < len(args):
        if args[i] == '--slug' and i + 1 < len(args):
            slug = args[i + 1]
            i += 2
        elif args[i] == '--category' and i + 1 < len(args):
            category = args[i + 1]
            i += 2
        elif args[i] == '--tags' and i + 1 < len(args):
            tags = [t.strip() for t in args[i + 1].split(',')]
            i += 2
        else:
            i += 1

    if not slug:
        slug = slugify(title)
    if not slug:
        slug = "post"

    return title, slug, category, tags

def main():
    title, slug, category, tags = parse_args()
    today = date.today()
    date_str = today.isoformat()

    filename = f"{slug}.html"
    filepath = os.path.join(POSTS_DIR, filename)

    if os.path.exists(filepath):
        print(f"错误: 文件已存在 -> {filepath}")
        sys.exit(1)

    # 生成标签 pills
    tag_pills = "\n".join(
        f'              <a href="../tags/index.html#tag-{tag}" class="meta-pill">#{tag}</a>'
        for tag in tags
    )

    # 生成 HTML
    html = TEMPLATE.format(
        title=title,
        date=date_str,
        year=today.year,
        category=category,
        category_name=category,
        tag_pills=tag_pills,
        content_placeholder=CONTENT_PLACEHOLDER,
    )

    os.makedirs(POSTS_DIR, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✓ 文章已创建: {filepath}")
    print()
    print("下一步操作:")
    print(f"  1. 编辑 {filename} 中的文章内容")
    print(f"  2. 更新 index.html 中的文章列表（复制一个 post-card 并修改链接）")
    print(f"  3. 更新 tags/index.html 和 categories/index.html 中的索引")
    print(f"  4. git add && git commit && git push")

if __name__ == '__main__':
    main()
