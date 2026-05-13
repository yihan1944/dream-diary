# 梦境日记分析器

React + Node.js 全栈应用，支持记录梦境、AI 情绪/主题分析、关键词词云可视化与日历视图。

## 技术栈

- **前端**: React + Vite + React Router + Recharts
- **后端**: Node.js + Express
- **存储**: JSON 文件本地存储
- **AI**: DeepSeek API

## 快速启动

### 1. 安装后端依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，填入你的 DeepSeek API Key：

```bash
cp .env.example .env
# 编辑 .env 文件，填入 DEEPSEEK_API_KEY
```

### 3. 启动后端服务

```bash
npm run dev
# 后端运行在 http://localhost:3001
```

### 4. 安装前端依赖并启动

```bash
cd ../frontend
npm install
npm run dev
# 前端运行在 http://localhost:5173
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/dreams | 获取梦境列表（支持 ?date= 或 ?month= 筛选） |
| POST | /api/dreams | 创建梦境 |
| PUT | /api/dreams/:id | 更新梦境 |
| DELETE | /api/dreams/:id | 删除梦境 |
| POST | /api/analyze/:id | AI 分析指定梦境 |
| GET | /api/analyze/keywords | 获取关键词频率 |
| GET | /api/analyze/mood-trend | 获取情绪趋势 |
