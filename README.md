# Mufire-star.github.io

我的个人博客 ✦ 记录工作、学习和生活

## 站点结构

```
├── index.html          # 主页（个人介绍 + 文章列表 + 分类网格）
├── css/
│   └── style.css       # 主样式表
├── tags/
│   └── index.html      # 标签页
├── categories/
│   └── index.html      # 分类页
├── about/
│   └── index.html      # 关于页
├── src/
│   ├── hello-world.html
│   ├── llm4hls-intro.html
│   ├── vivado-tips.html
│   ├── fpt26-progress.html
│   └── paper-writing.html
└── scripts/
    └── new_post.py     # 文章生成脚本
```

## 添加新文章

```bash
python scripts/new_post.py "文章标题" \
    --slug 文件名 \
    --category 分类名 \
    --tags 标签1,标签2
```

生成 HTML 后：
1. 编辑 `src/文件名.html` 中的文章内容
2. 复制一个 post-card 到 `index.html` 的文章列表
3. 更新 `tags/index.html` 和 `categories/index.html` 的索引
4. `git add && git commit && git push`

## 自定义

- **头像**：替换 `index.html` 中 `avatar-placeholder` 为 `<img>` 标签
- **背景**：编辑 `css/style.css` 中的 `body::before` 部分
- **个人信息**：编辑 `index.html` 中的 `profile-card` 区域

Powered by GitHub Pages
