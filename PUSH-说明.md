# Git Push 说明

## ✅ 本地提交已完成

**Commit ID**: `1dd0414`  
**版本**: v3.22  
**提交信息**: feat(v3.22): 重大修复 - 改为正确的 5 张手牌上下布局

## 📊 变更统计

- **8 个文件修改**
- **1514 行新增**
- **383 行删除**

### 新增文件 (6 个)
- `index.wxml` - 页面布局
- `index.wxss` - 样式文件
- `app.json` - 小程序配置
- `sitemap.json` - 站点地图
- `README-修复报告.md` - 修复文档
- `cards-config.json` - v3.22 配置

### 修改文件 (2 个)
- `game.js` - 重写游戏逻辑
- `project.config.json` - 更新配置

---

## 🚀 Push 到 GitHub

### 方法 1: 使用 GitHub Token

```bash
cd /root/.openclaw/workspace/wechat-link-game

# 设置 Git 用户信息（首次需要）
git config --global user.name "易辛"
git config --global user.email "your-email@example.com"

# 使用 Token push
git push origin main
# 输入 GitHub Token
```

### 方法 2: 改用 SSH

```bash
# 更改 remote 为 SSH
git remote set-url origin git@github.com:oshimadai/wechat-link-game.git

# Push
git push origin main
```

### 方法 3: 在 GitHub Desktop 中推送

1. 打开 GitHub Desktop
2. 选择 `wechat-link-game` 仓库
3. 看到 pending commit
4. 点击 "Push origin"

---

## 📝 拉取最新代码

呆汪要 pull 最新代码：

```bash
# 在你的电脑上
git clone https://github.com/oshimadai/wechat-link-game.git

# 或者如果已经有了
cd wechat-link-game
git pull origin main
```

然后在微信开发者工具中打开项目即可。

---

## 🎯 版本亮点

### v3.22 核心修复
- ✅ 5 张手牌制（之前是 36 张网格）
- ✅ 上下布局（之前是 6x6 网格）
- ✅ 玩家 2 旋转 180°（面对面设计）
- ✅ 血量格子显示（颜色对应属性）

### 与网页版一致
现在小程序和网页版 v3.22 保持一致的设计！

---

**提交时间**: 2026-03-13 11:17  
**状态**: ✅ 本地已提交，待 push
