import { user_service } from '@/apis/user_service';
import { ErrorMessage, SuccessMessage } from '@/utils/messageTool';
import { clearAllStores } from './clearAllStores';

const router = useRouter();

export const logout = () => {
  user_service
    .logout()
    .then((res) => {
      if (res.code === '200') {
        clearAllStores();
        SuccessMessage('退出成功');
        router.push('/');
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
