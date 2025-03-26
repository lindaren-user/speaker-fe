import { _isMobile } from './isMobile';

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
    ElMessage({
      showClose: true,
      type: 'error',
      message: msg,
    });
  }
};

export const WarningMessage = (msg) => {
  if (_isMobile()) {
    showFailToast(msg);
  } else {
    ElMessage({
      showClose: true,
      type: 'warning',
      message: msg,
    });
  }
};

export const MessageBox = (object) => {
  if (_isMobile()) {
    return showConfirmDialog({
      title: '!注意',
      message: `此操作将删除该${object}, 是否继续?`,
    });
  }
  return ElMessageBox.confirm(`此操作将删除该${object}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
};
