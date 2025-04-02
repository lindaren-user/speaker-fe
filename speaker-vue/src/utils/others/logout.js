import { user_service } from '@/apis/user_service';
import { ErrorMessage, SuccessMessage } from '@/utils/others/messageTool';
import { clearAllStores } from '../stores/clearAllStores';

export const logout = (router) => {
  user_service
    .logout()
    .then((res) => {
      if (res.code === '200') {
        clearAllStores();
        SuccessMessage('退出成功');
        router.push('/'); // 使用传递的 router
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err);
      ErrorMessage(err.message);
    });
};
