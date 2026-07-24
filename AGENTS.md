# P客 App — AGENTS.md

## Design tokens（强制）

- **一律使用 DESIGN.md / Tailwind 中已注册的 token**（颜色、字号、字重、圆角、间距、阴影等）。
- **禁止硬编码**：不要写裸 `#hex`、随意 `font-bold`/`font-[600]`、魔法 `px`/`rgba`，除非该值已作为命名 token 存在于 `DESIGN.md` → `tailwind.config.js` / `GAME`。
- 缺档时：**先在 `DESIGN.md` 增加命名 token，再落到 Tailwind/`GAME`，最后才在组件里引用**（如本项目的 `hud-label` = 13px/600，比 `hud-number` 细一档）。
- 栅格截图取色只作参考，**不得**直接当成新硬编码色写入代码。
- 品牌蓝文案用 `primary` / `primary-text`（二者同为 `#1671F8`）；CTA 渐变统一 `linear-gradient(135deg, primary, primary-light)`（`#1671F8 → #2F80FF`）。**禁止**再引入已废弃的品牌橙 `#FF6B0B` / `#C24C00`（DESIGN.md 品牌重塑已由橙转蓝，历史遗留的橙色硬编码属于待清理项，不是新代码可参考的样式）。
- **Toast**：复制/保存/校验/Demo 用 **System Toast**（白底 Soft card + 状态色仅用在左侧图标）；积分/升级/连续打卡用 **Celebration Toast**。二者规范见 `DESIGN.md`，禁止半透明玻璃条或品牌色铺底。

## 静态资源落点（强制）

新增或替换业务视觉资源时，**直接落到约定目录并改引用**，不要先内联在页面/弹窗里再事后搬迁。细则与移动端对照说明见 `app/src/assets/svg/README.md`。

| 类型 | 落点 | 用法 |
| --- | --- | --- |
| 业务自绘静态 SVG（形状固定、无 props 变外观） | `app/src/assets/svg/svg/custom/` | `import x from "@/assets/svg/svg/custom/<name>.svg?url"`，用 `<img>` / `src` 引用 |
| 光栅插画（WebP / PNG，礼盒、空状态等） | `app/src/assets/illustrations/` | `import x from "@/assets/illustrations/<name>.webp"`，优先 WebP；透明底用带 alpha 的 WebP |
| Lucide 通用图标 | 继续用 `lucide-react` | **不要**为业务页手写内联 Lucide path；`svg/lucide/` 仅作移动端对照归档 |
| 可参数化品牌/底栏图标（`currentColor`、filled 两态等） | `app/src/components/icons/*.tsx` | `svg/custom/` 里对应文件只是视觉快照，源码仍以组件为准 |

同步要求：

- 新增 `custom/` 静态 SVG 时：更新 `app/src/assets/svg/manifest.json` 的 `usedIn`，并在 `README.md` 的 custom 清单里补一行。
- 静态 SVG 的 fill/stroke 若需品牌色，**只能写已登记 token 的当前色值**（如 `reward-gold` `#E8B339`、`celebrate-red` `#E5484D`），并在文件内用注释标明对应 token；禁止自创色。
- **禁止**在业务页面/弹窗里长期保留内联业务 `<svg>`（`AppLayout` 的 goo 滤镜、以及 `components/icons` 参数化组件除外）。
- **禁止**把插画塞进 `svg/`，也禁止把自绘业务图标散落在 `public/` 或组件旁临时路径。

## 语言

- 默认用中文与用户沟通（除非用户要求英文）。

## Git Commit Message

- 本项目的 commit message 使用**中文**书写，符合中国开发者阅读习惯。
- 格式：`<type>: <中文描述>`，`type` 仍用英文惯例前缀（`feat`/`fix`/`refactor`/`docs`/`chore` 等），冒号后用中文说明改动内容。
- 例：`feat: 实名认证流程新增地区选择与支付解锁方式`。
