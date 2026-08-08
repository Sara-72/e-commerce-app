import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter,withComponentInputBinding } from '@angular/router';
import { provideHttpClient ,withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { headerInterceptor } from './core/interceptors/header-interceptor'; // <-- Import Interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([headerInterceptor])) // <-- Add Interceptor here
  ]
};
