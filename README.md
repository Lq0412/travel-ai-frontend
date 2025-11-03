# 🌍 智能 AI 旅游推荐平台 - 前端

> 基于 Vue 3 + TypeScript + Ant Design Vue 的现代化旅游推荐平台前端应用

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b983)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-4.x-1890ff)](https://antdv.com/)

## ✨ 功能特性

### 👥 用户端功能
- 🔐 用户注册/登录系统
- 🤖 AI 智能对话助手（支持数字人）
- 🏞️ 景点浏览与路线规划
- 💬 景点留言墙（弹幕效果）
- 🛒 商品购买与订单管理
- 📝 旅游攻略分享
- 🗓️ 个人旅游日历

### 👨‍💼 管理端功能
- 📊 用户管理
- 🏢 商家管理
- 🎯 景点管理
- 💬 留言墙管理（审核/删除）
- 📢 公告管理
- 📦 订单管理

### 🏪 商家端功能
- 📦 商品管理
- 📋 订单处理
- ⚙️ 店铺设置

## 🏗️ 技术架构

### 核心技术栈
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript 5.x
- **构建工具**: Vite 5.x
- **UI组件库**: Ant Design Vue 4.x
- **路由**: Vue Router 4.x
- **状态管理**: Pinia
- **HTTP客户端**: Axios

### 代码质量工具
- ✅ **统一错误处理**: 自定义errorHandler
- ✅ **智能日志系统**: 分级logger（开发/生产环境自动切换）
- ✅ **类型系统**: 完整的TypeScript类型定义
- ✅ **可复用逻辑**: Vue 3 Composables
- ✅ **常量管理**: 集中式配置

## 📁 项目结构

```
src/
├── api/                    # API接口层
│   ├── messageWallApi.ts  # 留言墙API (统一封装)
│   └── ...
├── components/            # 公共组件
│   ├── GlobalHeader.vue
│   ├── GlobalSider.vue
│   └── DigitalHumanIframe.vue
├── composables/           # 可复用逻辑
│   ├── useMessageWall.ts  # 留言墙Composable
│   ├── useChatStream.ts
│   └── useAutoScroll.ts
├── constants/             # 常量配置
│   └── index.ts           # 统一常量管理
├── layouts/               # 布局组件
│   └── BasicLayout.vue
├── pages/                 # 页面组件
│   ├── user/             # 用户端页面
│   ├── admin/            # 管理端页面
│   ├── merchant/         # 商家端页面
│   └── ...
├── router/               # 路由配置
│   └── index.ts
├── stores/               # 状态管理
│   └── useLoginUserStore.ts
├── types/                # TypeScript类型定义
│   ├── messageWall.ts
│   └── chat.ts
├── utils/                # 工具函数
│   ├── errorHandler.ts   # 统一错误处理
│   ├── logger.ts         # 日志管理
│   └── timeUtils.ts
├── App.vue
└── main.ts
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.x
- npm >= 8.x 或 pnpm >= 7.x

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发环境运行

```bash
npm run dev
```

访问 http://localhost:5173

### 生产环境构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件配置环境变量：

```env
# API基础URL
VITE_API_BASE_URL=http://localhost:8080/api

# 数字人服务URL
VITE_DIGITAL_HUMAN_URL=http://localhost:8888/static/MiniLive_RealTime.html
```

### 后端接口

默认后端API地址：`http://localhost:8080/api`

> 确保后端服务已启动，详见后端项目README

## 💡 核心功能说明

### 1. 留言墙功能
- 支持景点留言墙
- 弹幕动画效果
- 实时刷新
- 管理员审核机制

### 2. AI对话助手
- 智能旅游推荐
- 流式响应
- 对话历史管理
- 数字人交互（可选）

### 3. 商品购物
- 商品浏览
- 购物车管理
- 订单结算
- 订单跟踪


## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 👨‍💻 作者

Lq0412

## 🔗 相关项目

- [后端项目](../travel_backend) - 智能AI旅游推荐平台后端

## 📮 联系方式

如有问题或建议，请联系：
- Email: 15919508513@163.com
- GitHub: [Lq0412](https://github.com/Lq0412)

---

⭐ 如果这个项目对你有帮助，欢迎给个Star！
