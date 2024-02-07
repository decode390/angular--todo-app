import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../app.config';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  const newReq = req.clone({'url': `${apiUrl}${req.url}`});
  return next(newReq);
};
