---
title: ClashPC端教程
date: 2026-09-26 23:10:00
cover: https://i.stardots.io/d4t46/StarDots-2026092618264636395.jpg
subtitle: 从零到畅游国际网络
categories: 实用教程
tags: [Clash, Clash Verge Rev, 代理, 教程, 网络]
---

在日常上网过程中，很多人都会遇到访问受限、网络分流需求，或是希望更精细地控制流量走向的情况。**Clash** 正是为此而生的一款开源、规则驱动的代理工具。

它本身并不提供节点，而是通过**导入订阅配置**，智能判断哪些流量走代理、哪些直连，从而实现高效、灵活的网络管理。

<div class="kira-note tip"><strong>一句话理解</strong>　Clash 只负责「流量怎么走」，线路（节点）由你的订阅提供。所以软件刚装好时是「空」的，必须先导入订阅才能正常上网。</div>

原版 Clash 项目已于几年前停止维护，目前社区最活跃、功能最完善的图形客户端是 **Clash Verge Rev**（内置 Mihomo / Clash Meta 内核）。它支持 Windows、macOS、Linux 三大桌面平台，界面简洁，订阅管理方便，还支持系统代理与 TUN 模式，适合从新手到进阶用户使用。

本文将以 Clash Verge Rev 为例，从零开始讲解完整安装步骤与基础使用方法，帮助你快速上手，并尽量用清晰的结构和实用建议，让内容更易读、更实用。无论你是第一次接触这类工具，还是想从旧版客户端迁移过来，都可以直接跟着操作。

---

## 一、下载与安装

### 唯一官方下载地址

请只从 GitHub Releases 下载，这是唯一安全、官方的发布渠道：

**[github.com/clash-verge-rev/clash-verge-rev/releases/latest](https://github.com/clash-verge-rev/clash-verge-rev/releases/latest)**

打开页面后，展开 **Assets**，选择与你系统对应的安装包：

![Clash Verge Rev 官方下载页面](https://i.stardots.io/d4t46/StarDots-2026092622411714662.png)

<p class="kira-caption">图 1 · GitHub Releases 页面，展开 Assets 选择对应系统的安装包</p>

| 你的系统 | 建议下载的文件 |
| --- | --- |
| Windows（绝大多数电脑） | 文件名带 `x64` 的 `.exe` 安装包 |
| Windows（ARM 设备） | 文件名带 `arm64` 的 `.exe` |
| macOS（M 系列芯片） | 文件名带 `aarch64` 的 `.dmg` |
| macOS（Intel 芯片） | 文件名带 `x64` 的 `.dmg` |
| Linux | `.deb`（Debian / Ubuntu）或 `.AppImage`（通用） |

<div class="kira-note warn"><strong>注意</strong>　不要从搜索引擎广告位、网盘或所谓「机场打包版」下载。这类安装包可能被植入后门或挖矿程序，账号安全风险极高。</div>

---

## 二、基础使用方法

软件安装完成并打开后，只需要三步就能正常上网，所有操作都在左侧导航栏完成。

### 步骤 1 · 导入订阅

点击左侧 **「订阅」** → 把订阅链接粘贴到输入框 → 点击 **「导入」**。

![导入订阅](https://i.stardots.io/d4t46/StarDots-2026092622575917540.png)

<p class="kira-caption">图 2 · 在「订阅」页面粘贴订阅链接并导入</p>

导入成功后，列表里会出现一个配置文件卡片，**点击卡片把它启用**（正在使用的配置会有高亮标记）。

<div class="kira-note warn"><strong>注意</strong>　订阅链接相当于你的账号密钥（通常形如 <code>https://xxx/api/v1/client/subscribe?token=...</code>），请不要截图分享或粘贴到公开场合。</div>

### 步骤 2 · 选择节点

点击左侧 **「代理」**，先点一下 **延迟测试（测速）**，再选择一个延迟较低的节点。

![选择节点](https://i.stardots.io/d4t46/StarDots-2026092623010106449.png)

<p class="kira-caption">图 3 · 测速后挑选延迟较低的节点</p>

<div class="kira-note tip"><strong>小技巧</strong>　延迟低不等于速度快。延迟反映的是往返响应时间，主要影响网页打开的「跟手感」；看视频更依赖带宽，可以优先选显式标注了「流媒体」「Netflix」等用途的节点。</div>

### 步骤 3 · 开启系统代理

点击左侧 **「设置」**，打开 **系统代理** 开关。此时浏览器等软件的流量就会交给 Clash 处理。

![开启系统代理](https://i.stardots.io/d4t46/StarDots-2026092623023767865.png)

<p class="kira-caption">图 4 · 在「设置」页面打开系统代理</p>

<div class="kira-note"><strong>更进阶的 TUN 模式</strong>　如果某些软件不认系统代理（终端命令、部分游戏或 UWP 应用），可以在设置里打开 TUN 模式。它会创建一块虚拟网卡，在系统层面接管全部流量。代价是需要额外的服务或驱动权限（Windows 上会提示安装 wintun 服务），并且可能与其他 VPN、虚拟网卡冲突。日常使用系统代理已经足够。</div>

---

## 三、常见问题

<details><summary>❓ 导入订阅后列表是空的？</summary>多数是订阅链接被截断或已失效。重新复制完整链接（注意末尾不要带空格或换行），再点一次「导入」。如果仍然不行，把链接直接粘到浏览器地址栏打开：能下载到一个配置文件，说明链接本身没问题；打不开就说明订阅已过期，需要联系服务商。</details>

<details><summary>❓ 已经开了系统代理，网页还是打不开？</summary>按顺序排查：①「代理」页面里是否真的选中了某个节点；②延迟测试是否全部超时（全超时说明订阅或节点不可用）；③是否还开着其他代理软件，两个程序会抢占同一个本地端口；④换一个节点再试一次。</details>

<details><summary>❓ 延迟测试全是超时？</summary>先确认本地网络本身是通的（可以先关掉系统代理再试）。常见原因有三个：订阅已过期、所选节点已下线、或本地网络对相关端口做了限制。可以切换其他节点分组，或者重新拉取一次订阅。</details>

<details><summary>❓ 节点变了，怎么更新订阅？</summary>回到「订阅」页面，找到对应的配置卡片，点卡片上的刷新 / 更新按钮重新拉取一次配置（不同版本图标位置略有差异）。更新后建议重新测速，再挑一次节点。</details>

<details><summary>❓ 不想用了，怎么彻底断开？</summary>先在「设置」里关闭系统代理和 TUN 模式，再退出软件。如果先退出软件而忘了关系统代理，系统里可能残留一个指向本地端口、但已经没人监听的代理设置，浏览器就会连不上网——这时重新打开软件、把系统代理关掉即可恢复。</details>

---

## 四、上手自查清单

完成上面的步骤后，可以逐条核对一下：

- [x] 软件已从官方 Releases 下载并成功安装
- [x] 订阅已导入，「订阅」页面的配置卡片处于启用状态
- [x] 已完成延迟测试，并选中了一个延迟正常的节点
- [x] 「设置」里的系统代理已开启
- [x] 浏览器可以正常访问外网

---

<div class="kira-note warn"><strong>合规提示</strong>　请遵守所在地区的法律法规以及相关服务的使用条款。本文仅为客户端安装与配置的技术记录，请把工具用于合法的网络访问需求。</div>
