# JAVBUS 搜索工具

一个基于 Vue 3 的 JAV 视频搜索和磁力链接下载工具。

## 功能特性

- 🔍 **视频搜索**: 通过编号搜索JAV视频
- 📋 **详细信息**: 显示视频封面、基本信息、分类、演员等
- 💾 **磁力链接**: 获取并展示磁力链接，支持筛选和排序
- 🎯 **相似推荐**: 显示相似视频，一键搜索
- 📱 **响应式**: 适配移动端和桌面端
- ⚙️ **环境变量**: 支持自定义API地址

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 环境变量配置

项目使用环境变量来配置API地址，便于灵活切换不同的后端服务。

### 配置方法

1. **修改环境变量文件**:
   编辑 `.env` 文件，修改 `VITE_API_BASE_URL`:
   ```bash
   VITE_API_BASE_URL=https://av.020417.xyz
   ```

2. **使用不同环境配置**:
   - 开发环境：`.env`
   - 生产环境：`.env.production`
   - 测试环境：`.env.test`

3. **自定义API地址**:
   ```bash
   # 使用其他API服务
   VITE_API_BASE_URL=https://your-api-domain.com
   
   # 使用本地开发服务器
   VITE_API_BASE_URL=http://localhost:8080
   ```

### 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API基础地址 | `https://av.020417.xyz` |

## 使用方法

1. **启动应用**:
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

2. **搜索视频**:
   - 在搜索框输入视频编号（如：PPBD-145）
   - 按回车或点击搜索按钮

3. **查看信息**:
   - 查看视频详细信息
   - 浏览相似视频推荐

4. **获取磁力链接**:
   - 点击"下载磁力链接"按钮
   - 使用筛选器（高清、字幕）
   - 按大小或时间排序
   - 复制或下载磁力链接

## 项目结构

```
javbus-project/
├── src/
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口文件
│   ├── router/              # 路由配置
│   │   └── index.ts
│   └── views/
│       └── HomeView.vue     # 主页面组件
├── public/                  # 静态资源
├── .env                     # 环境变量
├── .env.example            # 环境变量示例
├── vite.config.ts          # Vite配置
└── package.json            # 项目依赖
```

## 技术栈

- **Vue 3**: 渐进式JavaScript框架
- **Vue Router**: 官方路由管理器
- **Vite**: 下一代前端构建工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

## API代理

项目配置了Vite代理来解决CORS问题：

```javascript
// vite.config.ts
proxy: {
  '/api': {
    target: process.env.VITE_API_BASE_URL || 'https://av.020417.xyz',
    changeOrigin: true,
    secure: false
  }
}
```

所有以 `/api` 开头的请求都会被代理到配置的API地址。

## 注意事项

1. **环境变量更新后需要重启开发服务器**
2. **生产环境需要重新构建项目**
3. **确保代理的API地址支持CORS**
4. **图片加载可能受源站防盗链影响**

## 常见问题

**Q: 如何修改API地址？**
A: 编辑 `.env` 文件中的 `VITE_API_BASE_URL`，重启开发服务器。

**Q: 如何添加新的筛选条件？**
A: 在 `HomeView.vue` 的 `filteredMagnets` 计算属性中添加过滤逻辑。

**Q: 如何修改端口号？**
A: 在 `vite.config.ts` 的 `server.port` 中配置。

## 许可证

MIT