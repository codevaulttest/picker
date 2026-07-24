# SVG 图标资源清单（供移动端转原生参考）

本目录汇总了 P客 App 项目里实际用到的矢量图标，供移动端开发对照转换为原生资源。**背景说明见下方"重要说明"**，请先读完再动手转换。

## 目录结构

```
svg/
├── lucide/    # 业务页面用到的 lucide-react 图标（含 1 个 @lucide/lab 图标），共 43 个
├── custom/    # 项目自绘的业务专属图标（原写在组件代码里的内联 <svg>），共 12 个
└── favicon.svg  # App 品牌 favicon 归档拷贝
```

`manifest.json` 是机器可读版本，每条记录包含 `{ name, file, source, usedIn }`，`usedIn` 指向原代码里用到该图标的文件（部分带括号说明）。

## 重要说明

### 1. lucide 图标是开源图标库，非项目自绘
`svg/lucide/` 下 42 个图标来自 [lucide](https://lucide.dev) 开源图标库（还有 1 个 `planet-lab.svg` 来自 `@lucide/lab` 扩展包）。移动端如果目标平台已有 lucide 的原生移植版本（如 iOS/Android 有对应的 SF Symbols 替代或 lucide 官方多平台包），建议直接使用对应库，而不是逐个转换这些 svg 文件——这里导出只是为了让你能一眼看到"项目实际用了哪些图标、长什么样"。

### 2. 只导出了业务层用到的图标，shadcn/ui 通用组件里的图标未导出
项目里 `src/components/ui/*`（shadcn/ui 组件库）内部也用了一些 lucide 图标（如对话框关闭按钮、复选框对勾），这些是纯 UI 库内部实现细节，跟这个 App 的产品视觉无关，移动端会用自己的组件库自然替代，因此**没有**收录在本目录。

### 3. `custom/` 里有 4 个是"参数化图标组件"的静态快照，不是真正独立的静态图标
以下文件对应的源码其实是**带逻辑的 React 组件**（根据 `filled`/`strokeWidth` 等 props 变化渲染），本目录里的 `.svg` 只是其中一个状态的快照，仅供参考视觉效果，**不是**组件的完整行为：

- `home-mark.svg` ← `src/components/icons/HomeMark.tsx`（品牌 Logo，颜色随 `currentColor` 切换）
- `profile-mark-outline.svg` / `profile-mark-filled.svg` ← `src/components/icons/ProfileMark.tsx`（底栏"我的"图标，未激活/激活两态）
- `donor-mark.svg` ← `src/components/icons/DonorMark.tsx`（底栏"东家"图标）
- `clipboard-check-filled.svg` ← `src/components/icons/ClipboardCheckFilled.tsx`（底栏"任务"图标，用 SVG mask 挖空对勾）

移动端实现这几个图标时，建议直接参考源码里的形状描述（圆形头像/心形握手/剪贴板+对勾），按原生平台的方式实现"填充/描边两态切换"，而不是简单地把快照文件套用。

### 4. `custom/` 里其余 8 个是真正的静态图标，已在源码里改为文件引用
以下图标是纯静态形状（无 props 影响外观），已经从内联 `<svg>` 提取为独立文件，并且**源码里也同步改成了从文件 import**（见 `manifest.json` 的 `usedIn`）：

- `back-arrow.svg` — 通用返回箭头，原本在 9 个页面里各自重复写了一遍，现在统一引用同一个文件
- `chevron-right-thin.svg` — CAS 应用中心列表项右侧箭头
- `id-card-front.svg` / `id-card-back.svg` — 实名认证弹窗的身份证上传占位图标
- `face-scan.svg` — 实名认证弹窗的人脸核验占位图标
- `check-success.svg` — 实名认证成功的对勾图标
- `check-in-gift.svg` — 首页连续签到卡片的礼盒图标（fill 对齐 `reward-gold` / `celebrate-red`）

### 5. `AppLayout.tsx` 里还有一处 `<svg>`，未收录 —— 它不是图标
`src/components/layout/AppLayout.tsx` 里唯一的内联 `<svg>` 是一个 0×0 的 SVG 滤镜定义（goo 滤镜，用于让底部导航栏凸起弧与栏体融合成一个圆润轮廓），本身不渲染任何可见图形。移动端实现底部导航时，这个"融合"视觉效果建议用原生的模糊/阴影/遮罩方式实现，无需转换成图标资源。

### 6. favicon.svg
`svg/favicon.svg` 是 `app/public/favicon.svg` 的归档拷贝（品牌 Logo 轮廓，与 `home-mark.svg` 同源）。Web 端 `index.html` 仍然引用 `public/` 里的原文件，本目录内的是给移动端看的参考副本。
