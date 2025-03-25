import request from '@/utils/request';

export const user_service = {
  login: (form) => request.post('/api/login', form),

  logout: () => request.get('/api/quit'),

  register: (form) => request.post('/api/register', form),

  check: () => request.get('/api/check'),
};
