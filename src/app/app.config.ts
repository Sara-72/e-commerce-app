import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { routes } from './app.routes';
import { headerInterceptor } from './core/interceptors/header-interceptor';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json`); // <-- Added ./assets/
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([headerInterceptor])),
    provideTranslateService({
      lang: 'en', // <-- Change 'defaultLanguage' to 'lang'
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
};
