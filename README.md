# 👁️ 视觉追踪训练 · 汉字学习系统

> 专为儿童设计的阅读视觉辅助 + 汉字学习 Web 应用

---

## 📖 项目简介

本项目是一款面向小学生的综合学习工具，结合**眼动训练**与**汉字学习**两大模块，帮助儿童提升阅读视觉能力，同时通过象形演化故事深入理解汉字起源。

---

## ✨ 功能模块

### 👀 视觉追踪训练
| 模块 | 说明 |
|------|------|
| 🔄 平滑追踪 | 训练眼球跟随目标平滑移动的能力 |
| ⚡ 快速扫视 | 训练眼球在文字间快速跳跃定位的能力 |
| 📖 阅读引导 | 跟随高亮词语进行节奏性阅读训练 |
| 💆 眼保健操 | 8节标准眼部放松操，动画引导完成 |

### ✍️ 汉字学习核心模块
| 模块 | 说明 |
|------|------|
| ✍️ 单字学习 | 10个常用汉字，含笔顺动画与描红练习 |
| 🗺️ 情境探索 | 3个主题场景，9个汉字，难度逐步递进 |
| 🌟 学习成果 | 当日学习汉字与训练完成情况总览 |
| 👨‍👩‍👧 家长报告 | 训练数据统计与个性化学习建议 |

### 📜 象形演化功能
每道题目卡片内嵌**汉字演化历程**三格展示：

```
甲骨文（远古图形）→ 金文（铸刻字形）→ 现代汉字
```

覆盖字符：山、水、日、木、火、月、土、手、人、一、口

---

## 🚀 快速开始

```bash
# 克隆仓库
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:8080` 查看应用。

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | UI 框架 |
| TypeScript | 5 | 类型安全 |
| Vite | 5 | 构建工具 |
| Tailwind CSS | 3 | 样式系统 |
| shadcn/ui | — | 基础 UI 组件库 |
| Recharts | 2 | 数据可视化（家长报告） |
| React Router | 6 | 页面路由 |
| Lucide React | — | 图标库 |

---

## 📁 项目结构

```
src/
├── assets/
│   └── owl-character.png       # 首页吉祥物猫头鹰
├── components/
│   ├── CharacterLearning.tsx   # 单字学习模块
│   ├── CharEvolutionStrip.tsx  # 汉字象形演化条（复用组件）
│   ├── ContextLearning.tsx     # 情境探索模块
│   ├── EyeExercise.tsx         # 眼保健操模块
│   ├── LearningResult.tsx      # 学习成果页
│   ├── ParentDashboard.tsx     # 家长报告页
│   ├── ProgressPanel.tsx       # 成就面板
│   ├── ReadingTrainer.tsx      # 阅读引导训练
│   ├── SaccadeTraining.tsx     # 快速扫视训练
│   └── SmoothPursuitTraining.tsx # 平滑追踪训练
├── data/
│   └── hanziData.ts            # 汉字数据 & 象形演化 SVG 数据
├── hooks/
│   └── useProgress.ts          # 进度管理 Hook（localStorage 持久化）
└── pages/
    └── Index.tsx               # 主页面 & 导航逻辑
```

---

## 💾 数据持久化

用户训练记录与学习进度通过 **localStorage** 本地保存，无需账号注册，数据存储在用户设备上，隐私安全。

存储键：`eye_path_progress`

---

## 📦 构建部署

```bash
# 生产构建
npm run build

# 预览构建产物
npm run preview

# 运行单元测试
npm test
```

---

## 📄 License

MIT
