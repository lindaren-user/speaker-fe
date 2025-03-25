import { _isMobile } from './isMobile';
import { showSuccessToast, showFailToast } from 'vant';

export const SuccessMessage = (msg) => {
  if (_isMobile()) {
    showSuccessToast(msg);
  } else {
    ElMessage({
      showClose: true,
      type: 'success',
      message: msg,
    });
  }
};

export const ErrorMessage = (msg) => {
  if (_isMobile()) {
    showFailToast(msg);
  } else {
    ElMessage.error(msg);
  }
};

export const WarningMessage = (msg) => {
  if (_isMobile()) {
    showFailToast(msg);
  } else {
    ElMessage.warning(msg);
  }
};
