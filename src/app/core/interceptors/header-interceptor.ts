import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve token from local storage (change 'userToken' if you named the key differently)
  const token = localStorage.getItem('userToken');

  // If token exists, clone request and add token header
  if (token) {
    req = req.clone({
      setHeaders: {
        token: token
      }
    });
  }

  return next(req);
};
