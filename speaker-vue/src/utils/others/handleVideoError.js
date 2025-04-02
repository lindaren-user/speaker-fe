import { ErrorMessage } from './messageTool';

export const handleVideoErrorFunc = (error) => {
  switch (error.target.error.code) {
    case error.target.error.MEDIA_ERR_ABORTED:
      ErrorMessage('视频加载被中止');
      break;
    case error.target.error.MEDIA_ERR_NETWORK:
      ErrorMessage('网络错误，无法加载视频');
      break;
    case error.target.error.MEDIA_ERR_DECODE:
      ErrorMessage('视频解码错误，可能是格式不支持');
      break;
    case error.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      ErrorMessage('视频格式不支持');
      break;
    default:
      ErrorMessage('未知错误');
  }
};
