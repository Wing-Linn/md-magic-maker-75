# 一周情绪日历

> 每天一句话，记录心情分值，生成属于你自己的一周情绪地图。

一个轻量、私密、无需注册的每日心情记录应用。数据只保存在浏览器本地，打开即用，关闭即走。

---

## ✨ 功能

- **每日记录**：用 1–10 分的滑块选择今天的心情，再写一句话（可选）。
- **一周情绪地图**：用卡片和曲线图直观查看本周心情起伏。
- **本周统计**：自动计算平均分、最高/最低心情日、记录天数和情绪波动幅度。
- **月度日历**：按月浏览历史记录，点击任意一天可查看或补记。
- **AI 周总结**：每周末一键生成温和的中文周总结，基于你写下的真实记录，不做诊断、不贴标签。
- **本地优先**：所有记录使用 `localStorage` 保存在当前设备，无需账号，不上传云端。

---

## 🎨 设计方向

采用「手账笔记」风格：柔和的纸张底色、衬线标题、无攻击性的暖色心情梯度，让记录心情这件事像翻开一本自己的日记本。

心情分值使用冷色到暖色的连续渐变，低分时是安静的蓝绿色，高分时像午后阳光，没有刺眼的红色警告。

---

## 🛠 技术栈

- [TanStack Start](https://tanstack.com/start) — 全栈 React 框架
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) — 原子化样式
- [Radix UI](https://www.radix-ui.com/) — 无障碍组件原语
- [Lovable AI Gateway](https://docs.lovable.dev/features/cloud) — AI 周总结后端

---

## 🚀 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd <repository-name>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

默认在 `http://localhost:8080` 打开。

---

## 📦 构建

```bash
# 生产构建
npm run build

# 本地预览生产包
npm run preview
```

---

## 📁 项目结构

```
src/
├── components/mood/        # 情绪相关 UI 组件
│   ├── TodayCard.tsx       # 今日记录卡片
│   ├── WeekChart.tsx       # 一周心情曲线图
│   ├── WeekStatsCard.tsx   # 本周统计
│   ├── MoodCalendar.tsx    # 月度日历
│   ├── DayDetailDialog.tsx # 单日详情/编辑弹窗
│   └── AiSummaryCard.tsx   # AI 周总结卡片
├── lib/
│   ├── mood.ts             # 数据类型、localStorage 读写、统计计算
│   └── weekly-summary.functions.ts  # AI 总结 server function
├── routes/
│   ├── __root.tsx          # 根布局、字体、全局 meta
│   └── index.tsx           # 首页
└── styles.css              # 设计令牌、主题变量、自定义动画
```

---

## 🔒 隐私说明

- 所有心情记录仅存储在浏览器 `localStorage` 中。
- 不使用账号系统，不收集个人信息。
- 更换浏览器、清除缓存或卸载应用都会导致数据丢失；如需长期保存，请自行备份。
- AI 周总结只在点击「生成总结」时发送本周记录到服务端，不会自动上传。

---

## 🤖 AI 周总结

AI 总结基于你当周写下的真实文字和心情值生成，遵循以下原则：

- 不虚构未提及的事件；
- 事实与推测分开表达；
- 不做心理诊断或医学结论；
- 不将短期记录解释为人格特征；
- 记录少于 3 天时会明确说明「暂时无法总结明显规律」。

> 本应用提供的 AI 总结仅供参考，不能替代专业心理咨询或医疗建议。

---

## 📝 开源协议

本项目代码由你自由使用与修改。具体许可证请查看仓库中的 LICENSE 文件（如有）。
