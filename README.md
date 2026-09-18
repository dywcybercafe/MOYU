# MOYU 第一版

本版本在原 UI 风格上实现了本地书库、四种格式导入、阅读位置、Word 随机吐字阅读和 Esc 基础伪装。

## 运行

为保证浏览器允许加载本地 PDF 解析模块，请不要直接双击 `index.html`。在本目录启动静态服务器：

```bash
python3 -m http.server 4173
```

然后打开 `http://localhost:4173/`。

书籍正文和进度保存在当前浏览器的 IndexedDB 中。清除该站点的浏览数据会同时清空书库。
