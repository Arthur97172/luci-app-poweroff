#
# Copyright (C) 2026 Arthur97172 <arthur97172@outlook.com>
#
# This is free software, licensed under the GNU General Public License v3.0
# (SPDX: GPL-3.0-only).
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-poweroff
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_LICENSE:=GPL-3.0-only
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=Arthur97172 <Arthur97172@users.noreply.github.com>

LUCI_TITLE:=A simple LuCI application that provides a convenient button to power off your router or device safely.
LUCI_DEPENDS:=+luci-base
LUCI_PKGARCH:=all
LUCI_URL:=https://github.com/Arthur97172/luci-app-poweroff
LUCI_MAINTAINER:=Arthur97172 <Arthur97172@users.noreply.github.com>

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature

