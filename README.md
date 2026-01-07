# JAVBUS 搜索工具 - Vercel 部署版本

## 项目说明

这是一个使用 Vue 3 + Ant Design Vue 构建的 JAVBUS 搜索工具，支持密码验证和视频搜索功能。

## 主要特性

- ✅ 密码验证访问保护
- ✅ 视频搜索和详细信息展示
- ✅ 磁力链接获取和管理
- ✅ 相似视频推荐
- ✅ Ant Design Vue UI 组件
- ✅ 响应式设计
- ✅ Vercel 兼容部署

## Vercel 部署步骤

### 1. 准备工作
- 将代码推送到 GitHub 仓库
- 注册 Vercel 账户

### 2. 环境变量配置
在 Vercel 项目设置中添加以下环境变量：

```
VITE_API_BASE_URL=
VITE_ACCESS_PASSWORD=你的访问密码
```

### 3. 部署配置
Vercel 会自动检测项目并使用以下配置：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. 访问网站
部署完成后，访问生成的 URL，输入密码即可使用。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## API 配置

项目默认使用 `https://av-api.020417.xyz` 作为 API 地址，你可以通过修改 `.env` 文件中的 `VITE_API_BASE_URL` 来更改。

## 密码配置

在 `.env` 文件中配置访问密码：
```
VITE_ACCESS_PASSWORD=你的密码
```

## 项目结构

```
src/
├── App.vue              # 主应用组件
├── main.ts              # 应用入口
├── assets/
│   └── main.css         # 全局样式
├── router/
│   └── index.ts         # 路由配置
└── views/
    ├── HomeView.vue     # 主页面
    └── PasswordView.vue # 密码验证页面
```

## 注意事项

1. **Vercel 部署**：由于 Vercel 不支持代理，项目使用直接 API 调用
2. **环境变量**：必须在 Vercel 中配置环境变量才能正常工作
3. **构建警告**：Ant Design Vue 包较大，这是正常现象

## 许可证

MIT│   ├── main.ts              # 入口文件
