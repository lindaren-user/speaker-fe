import { useUserStore } from '@/stores/user';
import { useProcessedModelStore } from '@/stores/processedModel';
import { user_service } from '@/apis/user_service';

export const checkLogin = () => {
  //   user_service
  //     .check()
  //     .then((res) => {
  //       if (res.code != 200) {
  //         useUserStore().clearStore();
  //         useProcessedModelStore().clearStore();
  //         return false;
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       // ...
  //       return false;
  //     });
  return true;
};
