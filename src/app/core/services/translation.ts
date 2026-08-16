import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly _translateService = inject(TranslateService);

  constructor() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this._translateService.addLangs(['en', 'ar']);
    this.changeLang(savedLang);
  }

  changeLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this._translateService.use(lang);

    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }

 getCurrentLang(): string {
  return this._translateService.currentLang() || 'en'; // Call as a function ()
}
}
