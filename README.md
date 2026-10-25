# LuCI App Poweroff

**简体中文** | [English](README.en.md)

为 OpenWrt / ImmortalWrt 提供「一键关机」页面的 LuCI 应用。

> ⚠️ 关机后设备不会自动重启，需要手动断电再重新上电。

![LuCI App Poweroff 截图](screenshot.png)

## 功能特性

- 在 LuCI 的「系统」菜单中添加「关机」页面，并提供确认弹窗，避免误触
- 关机前检测未提交的 UCI 配置修改并给出警告
- 通过 rpcd 执行 `/sbin/poweroff`，遵循 LuCI 的 ACL 权限模型
- 兼容 LuCI 亮色 / 暗色主题，无自定义颜色与内联样式
- 提供简体中文翻译（`luci-i18n-poweroff-zh-cn`）
- 纯前端资源包，架构无关（`all`）

## 安装

### 从 Releases 安装

1. 在 [Releases](https://github.com/Arthur97172/luci-app-poweroff/releases) 下载对应格式的包。
2. 将包上传到设备（例如 `/tmp`）后安装。

OpenWrt 24.10 及更早：

```sh
opkg install /tmp/luci-app-poweroff_*.ipk
# 可选：中文翻译
opkg install /tmp/luci-i18n-poweroff-zh-cn_*.ipk
```

OpenWrt 25.12+：

```sh
apk add --allow-untrusted /tmp/luci-app-poweroff-*.apk
# 可选：中文翻译
apk add --allow-untrusted /tmp/luci-i18n-poweroff-zh-cn-*.apk
```

3. 刷新 LuCI 页面，在「系统 → 关机」中即可看到入口。

### 从源码编译

```sh
cd openwrt
./scripts/feeds update -a
./scripts/feeds install -a
git clone https://github.com/Arthur97172/luci-app-poweroff.git package/luci-app-poweroff
make menuconfig   # LuCI → Applications → luci-app-poweroff
make package/luci-app-poweroff/compile V=s
```

产物位于 `bin/packages/<架构>/luci/`。仓库的 GitHub Actions 会自动为两个版本分别构建 `.ipk` 和 `.apk`。

## 兼容性

| 系统 | 包格式 | 包管理器 |
| --- | --- | --- |
| OpenWrt / ImmortalWrt 24.10 及更早 | `.ipk` | opkg |
| OpenWrt / ImmortalWrt 25.12+ | `.apk` | apk |

- 依赖：`luci-base`（已包含 `rpcd` 与 `rpcd-mod-file`）
- 架构：`all`
- 仅当系统存在 `/sbin/poweroff` 时显示菜单项（BusyBox 的 `poweroff` 默认启用）

## 使用

1. 进入「系统 → 关机」。
2. 点击「执行关机」。
3. 在确认弹窗中点击「确认关机」。

如果当前会话存在未保存的配置修改，页面会显示警告横幅。关机后设备需要手动上电。

## 权限说明

应用通过 rpcd 的 `file.exec` 执行 `/sbin/poweroff`。对应的 ACL 组 `luci-app-poweroff` 只授予：

- 以 `exec` 方式执行 `/sbin/poweroff`
- 调用 `ubus` 中 `file` 对象的 `exec` 方法

`root` 默认拥有全部权限；如需让其他用户使用，请在「系统 → 管理权」中为其分配该 ACL 组。

## 国际化

- 界面语言取决于 LuCI 的语言设置，未安装翻译包时显示英文。
- 简体中文翻译由独立的 `luci-i18n-poweroff-zh-cn` 包提供。

## 目录结构

```
.
├── .github/workflows/build.yml                  # CI：构建 ipk / apk 并发布
├── htdocs/luci-static/resources/view/system/
│   └── poweroff.js                              # 前端视图
├── po/
│   ├── templates/poweroff.pot                   # 翻译模板
│   └── zh_Hans/poweroff.po                      # 简体中文翻译
├── root/usr/share/luci/menu.d/                  # 菜单定义
├── root/usr/share/rpcd/acl.d/                   # ACL 定义
├── Makefile
└── LICENSE
```

## 许可

[GPL-3.0-only](LICENSE)
