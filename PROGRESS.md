# 网站改造记录 / Handoff Notes

> 更新日期：2026-09-04 · 下次继续时可从这份记录恢复上下文。

## 已完成

### 1. 架构与视觉重构（2026-09-03）

- 从 HTML5 UP “Dimension” 弹层模板，重构为现代深色天文主题单页站点。
- 新结构：固定毛玻璃导航 + 六个区块（About / Research / Publications / Talks / Observations / Contact）。
- 新视觉：星空 canvas 背景、径向光晕、Hero 环形头像、滚动显现动画、卡片与时间线。
- 重写文件：
  - `index.html`
  - `assets/css/main.css`
  - `assets/js/main.js`
- 交互：scrollspy、移动端菜单、reduced-motion 支持、Like 按钮改用 localStorage。

### 2. 按 2026-09 版简历更新内容

- 身份改为 **KIPAC Postdoctoral Fellow @ Stanford University**。
- 经历时间线：KIPAC Fellow（2026—）、MPIA 博后（2025—2026）、MPIA/海德堡博士（2021—2025，2025-07 答辩）、清华本科（2017—2021）。
- 邮箱改为 **astrozxy@stanford.edu**，地址与页脚更新为 Stanford / KIPAC。
- Talks 补充 2024–2025 年在 CfA、MIT、LBNL/Berkeley、KIPAC、Paris-Saclay、NAOC、Caltech 的报告。
- Publications 补充：Green, Zhang & Zhang 2025, ApJ 988, 5 (ADS + arXiv)。
- `CV/CV_zxy_2026.pdf` 已由用户替换为新版简历（已纳入本记录提交）。

### 3. Research 图片区反馈（2026-09-04）

- 用户反馈：图片有边框感，图内底色与页面不一致。
- 已处理：去掉 `.project__media` 的描边、阴影与容器底色；改为透明背景 + 图片边缘轻微径向渐隐。
- 尚未得到用户对新效果的确认（见“待继续”）。

## 待继续

1. **确认 Research 图片效果**：
   - 用户需确认渐隐方案是否合适（可调强度/范围）。
   - `images/Bird_eye_with_O_stars_slides_version.png` 是浅色底 + 透明区域，在深色页面仍偏亮；可考虑换成深色版本或把透明区域叠到黑底上导出一份。
2. **可选内容补全（来自 CV）**：Ernst Patzer Award、审稿/服务经历、Effelsberg co-I 观测、2020 年微透镜论文等，用户尚未要求。
3. **遗留文件清理**（未删除，避免误伤）：
   - 旧模板资源：`assets/sass/`、`assets/js/jquery.min.js`、`browser.min.js`、`breakpoints.min.js`、`util.js`、`font-awesome*`、`noscript.css`、`assets/js/like.js`。
   - 本地杂项：`.ipynb_checkpoints/`、`convert_color.ipynb`。
4. 如需上线，确认后 `git push`。

## 本地预览

```bash
python3 -m http.server 8643 --bind 127.0.0.1
```

访问 `http://127.0.0.1:8643/`。
