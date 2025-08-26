# 🏛️ 千年经济分析系统

> 穿越千年历史，洞察财富密码 - 基于真实历史数据的经济分析平台

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?style=flat-square&logo=github)](https://github.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📖 项目简介

千年经济分析系统是一个基于1000年历史数据的交互式经济分析平台，通过深度挖掘历史上重大事件对经济的影响，揭示经济、政治、天灾、GDP等因素对房价、股市、黄金价格的深层影响规律。

### 🎯 核心价值
- **历史智慧**: 从历史中学习投资规律
- **数据驱动**: 基于真实历史数据分析
- **交互体验**: 直观的可视化操作界面
- **专业分析**: 学术级的数据验证标准

## ✨ 功能特色

### 🏛️ 历史分析
- **1348年黑死病大流行**: 欧洲人口锐减60%，房价暴跌70%
- **1492年地理大发现**: 全球贸易增长500%，开启价格革命
- **1929年美国大萧条**: 股市暴跌89%，失业率达25%
- **2008年全球金融危机**: 次贷危机引发金融海啸

### ⚙️ 经济因子分析
- **动态权重调节**: 实时调整经济、政治、天灾、GDP四大因子
- **智能计算**: 自动归一化权重，确保分析准确性
- **可视化展示**: 动态饼图实时反映因子影响力
- **假设分析**: 模拟不同经济场景下的资产表现

### 📈 分析结果展示
- **实时图表**: Canvas绘制的动态价格走势图
- **资产对比**: 房价、股市、黄金三大资产类别分析
- **深度解读**: 专业的经济分析和投资启示
- **历史事件**: 关键时间节点和影响分析

### 🔄 年份对比功能
- **多维对比**: 支持最多4个年份同时对比
- **热门推荐**: 一键应用经典历史对比案例
- **智能分析**: 自动识别相似点和差异点
- **数据导出**: 支持对比报告导出和分享

## 🚀 快速开始

### 在线体验
直接访问：[在线演示地址](https://eastandweast.github.io/millennium-economic-analysis/)

### 本地运行
```bash
# 1. 克隆项目
git clone https://github.com/your-username/millennium-economic-analysis.git

# 2. 进入项目目录
cd millennium-economic-analysis

# 3. 使用本地服务器运行（推荐）
# 方法1: 使用Python
python -m http.server 8000

# 方法2: 使用Node.js
npx serve .

# 方法3: 直接打开index.html（部分功能可能受限）
```

### 使用指南
1. **首页导航**: 了解系统功能和特色
2. **历史分析**: 选择年份，查看历史事件和经济数据
3. **经济因子**: 调节权重，分析不同因素的影响
4. **分析结果**: 查看详细的资产价格分析报告
5. **年份对比**: 对比不同历史时期，发现投资规律

## 🎮 交互功能

### ⌨️ 键盘快捷键
- `Ctrl + 1`: 跳转到首页
- `Ctrl + 2`: 跳转到历史分析页面
- `Ctrl + 3`: 跳转到经济因子页面
- `Ctrl + 4`: 跳转到分析结果页面
- `Ctrl + 5`: 跳转到年份对比页面
- `←/→`: 调整时间轴年份
- `Space`: 播放/暂停时间轴动画
- `Esc`: 关闭通知提示

### 🖱️ 鼠标操作
- **时间轴拖拽**: 快速切换历史年份
- **因子滑块**: 调节经济因子权重
- **图表交互**: 切换不同资产数据显示
- **悬浮提示**: 智能操作引导

## 🛠️ 技术架构

### 前端技术栈
- **HTML5**: 语义化结构
- **CSS3**: 现代样式和动画
- **JavaScript ES6+**: 模块化开发
- **Tailwind CSS**: 原子化CSS框架
- **Canvas API**: 高性能图表绘制

### 项目结构
```
millennium-economic-analysis/
├── index.html                 # 首页
├── 历史分析页面.html           # 历史分析功能
├── 经济因子页面.html           # 经济因子调节
├── 分析结果页面.html           # 分析结果展示
├── 年份对比页面.html           # 年份对比功能
├── js/
│   ├── historical-data.js     # 历史数据库
│   ├── core.js               # 核心功能模块
│   ├── charts.js             # 图表功能模块
│   ├── comparison.js         # 对比功能模块
│   └── interactions.js       # 交互增强模块
├── docs/                     # 文档目录
│   ├── 测试报告.md
│   ├── 历史数据验证报告.md
│   └── 项目部署检查清单.md
└── README.md                 # 项目说明
```

### 设计模式
- **观察者模式**: 年份变化事件系统
- **单例模式**: 全局数据管理
- **策略模式**: 不同图表渲染策略
- **工厂模式**: 动态UI组件创建

## 📊 数据来源

### 学术文献
- 《剑桥欧洲经济史》- 中世纪经济数据
- 《世界经济千年史》- 安格斯·麦迪森著
- 《大萧条》- 本·伯南克研究
- 《这次不一样》- 莱因哈特&罗格夫金融危机研究

### 官方数据
- IMF国际货币基金组织
- 世界银行统计数据
- 美联储历史数据
- 各国央行官方统计

## 🌐 浏览器支持

| 浏览器 | 版本要求 | 支持状态 |
|--------|----------|----------|
| Chrome | 80+ | ✅ 完全支持 |
| Firefox | 75+ | ✅ 完全支持 |
| Safari | 13+ | ✅ 完全支持 |
| Edge | 80+ | ✅ 完全支持 |

## 📱 响应式设计

- **桌面端**: 1920x1080及以上分辨率优化
- **平板端**: 768px-1024px适配
- **移动端**: 320px-768px响应式布局
- **高分屏**: 支持Retina和4K显示

## 🎯 性能指标

- **首屏加载**: < 2秒
- **交互响应**: < 200ms
- **图表渲染**: < 500ms
- **内存使用**: < 100MB
- **兼容性**: 95%+现代浏览器

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发环境
1. Fork本项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交Pull Request

### 代码规范
- 使用ES6+语法
- 遵循JSDoc注释规范
- 保持代码简洁易读
- 添加必要的测试用例

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 👨‍💻 作者信息

- **项目作者**: [您的姓名]
- **联系邮箱**: [您的邮箱]
- **GitHub**: [您的GitHub]
- **个人网站**: [您的网站]

## 🙏 致谢

感谢以下项目和资源：
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的CSS框架
- [MDN Web Docs](https://developer.mozilla.org/) - 权威的Web技术文档
- 各位历史学家和经济学家的研究成果

## 📈 项目统计

![GitHub stars](https://img.shields.io/github/stars/your-username/millennium-economic-analysis?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/millennium-economic-analysis?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/millennium-economic-analysis)
![GitHub license](https://img.shields.io/github/license/your-username/millennium-economic-analysis)

---

⭐ 如果这个项目对您有帮助，请给个Star支持一下！

📧 有任何问题或建议，欢迎提Issue或发邮件交流！
