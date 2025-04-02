export const _isMobile = () => {
  // 1. 通过用户代理（User Agent）检测
  const userAgent = navigator.userAgent.toLowerCase();
  const isUserAgentMobile = /(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(
    userAgent,
  );

  // 2. 通过屏幕尺寸和交互能力检测
  const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 768;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 3. 排除桌面浏览器缩放或开发者工具模拟的情况
  const isDesktopBrowser =
    userAgent.includes('windows') ||
    userAgent.includes('macintosh') ||
    userAgent.includes('linux x86_64');

  // 4. 最终判断逻辑
  if (isDesktopBrowser) {
    // 如果是桌面浏览器，即使窗口缩小或模拟移动端，也按桌面端处理
    return false;
  }

  // 移动端条件：用户代理匹配移动设备，且（屏幕小或支持触摸）
  return isUserAgentMobile && (isSmallScreen || isTouchDevice);
};
