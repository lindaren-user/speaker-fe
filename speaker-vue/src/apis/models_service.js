import request from '@/utils/request';

export const models_service = {
  getAllModels: () => request.get('/api/modelList'),

  updateModel: (data) => request.put('/api/updateModel', data),

  addModel: (data) => request.post('/api/addModel', data),

  deleteModel: (data) => request.delete('/api/deleteModel', data),

  trainModel: (data) => request.get('/api/train', data),
};
