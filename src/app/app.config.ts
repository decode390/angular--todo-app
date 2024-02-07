import { urlInterceptor } from './interceptors/url.interceptor';
import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { UrlInterceptor } from './interceptors/url.interceptor.t';

export const API_URL = new InjectionToken<string>('api.url');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    // provideHttpClient(
    //   withInterceptors([
    //     urlInterceptor
    //   ])
    // ),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: API_URL,
      useValue: environment.apiUrl
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptor,
      multi: true
    }
  ],
};
