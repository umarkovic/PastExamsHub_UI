import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
  }
  return next(req);
};
