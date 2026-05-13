# 梦境日记分析器

React + Node.js 全栈应用，支持记录梦境、AI 情绪/主题分析、关键词词云可视化与日历视图。

## 技术栈

- **前端**: React + Vite + React Router + Recharts
- **后端**: Node.js + Express + Mongoose
- **存储**: MongoDB
- **AI**: DeepSeek API

## 快速启动

### 1. 启动 MongoDB

```bash
# 本地 MongoDB
mongod --dbpath ./data

# 或使用 MongoDB Atlas 免费云数据库
# https://www.mongodb.com/atlas/database
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，填入 API Key 和 MongoDB 连接地址：

```bash
cp .env.example .env
```

`.env` 内容：
```
DEEPSEEK_API_KEY=sk-xxxx
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dream-diary
PORT=3001
```

### 4. 启动后端服务

```bash
npm run dev
# 后端运行在 http://localhost:3001
```

### 5. 安装前端依赖并启动

```bash
cd ../frontend
npm install
npm run dev
# 前端运行在 http://localhost:5173
```

## 免费部署

| 层 | 平台 | 说明 |
|------|------|------|
| 前端 | Vercel | 免费静态托管，连接 GitHub 自动部署 |
| 后端 | Render | Node.js 免费额度，支持 MongoDB 连接 |
| 数据库 | MongoDB Atlas | 免费 512MB，注册即用 |

部署配置见 `render.yaml`。

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
