// 移动端判断
export const _isMobile = () => {
  // 通过 userAgent 判断
  const isUserAgentMobile =
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    ) !== null;

  // 通过屏幕宽度判断
  const isScreenWidthSmall = window.innerWidth < 768;

  // 通过 orientation 判断
  const isOrientationSupported = typeof window.orientation !== 'undefined';

  // 通过触摸点判断
  const isTouchDevice = navigator.maxTouchPoints > 0;

  // 综合判断
  return isUserAgentMobile || isScreenWidthSmall || isOrientationSupported || isTouchDevice;
};
