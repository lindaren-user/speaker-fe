import request from '@/utils/requests/request';
import formRequest from '@/utils/requests/formRequest';

export const files_service = {
  video: {
    uploadAllVideos: (formData) => formRequest.post('/api/upload', formData),

    uploadVideo: (formData) => formRequest.post('/api/infer', formData),

    getAllVideos: (data) => request.get('/api/list', data),

    getSelectVideo: (data) => request.get('/api/getVideo', data),

    updateVideoTag: (data) => request.put('/api/updateTag', data),

    deleteVideo: (data) => request.delete('/api/deleteVideo', data),

    deleteVideoTag: (data) => request.put('/api/deleteTag', null, data),
  },

  audio: {
    toText: (formData) => formRequest.post('/api/audio2text', formData),
  },
};
