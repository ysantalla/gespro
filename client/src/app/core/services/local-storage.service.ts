import { PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser} from '@angular/common';

const APP_PREFIX = 'APP-';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  setItem(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
    }
  }

  getItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return JSON.parse(localStorage.getItem(`${APP_PREFIX}${key}`));
      } catch (error) {
        console.log(error);
      }
    }
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(`${APP_PREFIX}${key}`);
    }
  }

}
