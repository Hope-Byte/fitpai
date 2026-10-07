# Fit拍 · 私人健身教练 📷💪

一个可安装到 **华为 Mate 60**（及其它 Android/iPhone）的 **PWA 健身 APP**。拍照识别器械/动作，自动生成一周 3-4 练的个性化训练计划，支持打卡记录、动作图文示范与进度追踪。数据全部保存在手机本地，支持离线使用。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 📷 拍照识别 | 拍摄健身器械或动作，AI 识别后推荐对应训练动作（未配置 AI 时也可手动选择器械） |
| 🗓️ 一周 3-4 练 | 自动生成推/拉/腿、上/下分化等课表，周几训练一目了然 |
| ✅ 打卡与进度 | 每日训练标记完成、累计次数、连续打卡天数 |
| 🎬 动作图文/视频示范 | 内置 77 个动作：动态演示动画、分步骤讲解、动作要点、教练提示 + 视频教程链接 |
| 🧘 普拉提 & 拉伸模块 | 独立的普拉提核心训练与全身拉伸放松模块，一键整套跟练 |
| 👤 个人档案 | 身高体重、增肌/减脂/塑形/力量目标、训练水平、可用器械 |
| 📱 离线可用 | Service Worker 缓存，断网也能打开使用 |

## 🚀 如何在 Mate 60 上使用

相机拍照需要 **HTTPS**（或 `localhost`）安全环境，推荐任选一种方式：

### 方式一：部署到免费静态托管（推荐，可获得 HTTPS）

把整个项目文件夹上传到任意静态托管即可，手机浏览器打开网址后选择「添加到主屏幕」，即可像原生 APP 一样使用：

- **GitHub Pages** / **Vercel** / **Netlify** / **Cloudflare Pages**（上传即得 HTTPS）
- 国内可访问：**Gitee Pages**、**腾讯云 COS / 阿里云 OSS 静态网站托管**

### 方式二：本地局域网测试（仅用于调试）

在电脑上项目目录启动静态服务，手机与电脑连同一 WiFi：

```bash
# 任选其一
python -m http.server 8080
npx serve -l 8080
```

然后手机访问 `http://电脑IP:8080`。⚠️ 注意：HTTP 下浏览器会**禁用相机**，仅能手动选择器械；要启用拍照，需用方式一获得 HTTPS，或用隧道工具（如 `cloudflared` / `ngrok`）生成 HTTPS 临时地址。

## 🤖 配置 AI 拍照识别（可选）

拍照识别依赖一个**视觉大模型接口**，不配置也能正常使用 APP（走手动选择器械）。配置方法：打开 APP →「我的」→「AI 识别配置」。

支持两类接口：

**1. OpenAI 兼容接口（推荐）**，填「接口地址 + API Key + 模型名」，例如：

| 服务商 | 接口地址 Base URL | 视觉模型名 |
|--------|------------------|-----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-vl-plus` 或 `qwen-vl-max` |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-4v-plus` |
| Kimi | `https://api.moonshot.cn/v1` | 按官方文档选视觉模型 |

**2. Google Gemini**：服务商选「Google Gemini」，填 API Key 与 `gemini-1.5-flash` 等模型名。

> 🔒 API Key 只保存在你手机浏览器的 localStorage 中，不会上传到任何第三方服务器。

## 📂 项目结构

```
├── index.html           # 应用入口
├── manifest.json        # PWA 清单
├── sw.js                # Service Worker（离线缓存）
├── css/styles.css       # 样式
├── js/
│   ├── data.js          # 器械库 / 动作库 / 训练计划模板
│   ├── db.js            # 本地存储（localStorage）
│   ├── camera.js        # 摄像头与图片采集
│   ├── ai.js            # AI 视觉识别（OpenAI 兼容 / Gemini）
│   └── app.js           # 主界面与交互逻辑
├── icons/               # 应用图标（SVG + PNG）
└── scripts/
    ├── gen_icons.py     # 生成 PNG 图标（Pillow）
    ├── smoke_test.js    # 数据完整性测试
    └── serve_test.js    # 静态资源服务测试
```

## 🛠 本地开发与测试

```bash
# 语法与数据完整性检查
node scripts/smoke_test.js
node scripts/serve_test.js

# 重新生成 PNG 图标（已包含，通常无需再跑）
python scripts/gen_icons.py
```

## ⚠️ 提示

- 首次使用会引导你填写档案并自动生成计划；「我的」页可随时重新生成。
- 训练动作的组数、次数为通用建议值，请根据自身情况调整，量力而行。
- 如有伤病或健康疑虑，建议先咨询专业教练或医生。
