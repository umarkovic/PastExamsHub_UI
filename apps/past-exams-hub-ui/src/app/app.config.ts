import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthenticationService } from './shared/services/authentication.service';
import {
  Configuration as CoreConfiguration,
  ApiModule as CoreApiModule,
} from '@org/portal/data-access';
import {
  Configuration as AuthorityConfiguration,
  ApiModule as AuthorityApiModule,
} from '@org/authority/data-access';
import { environment } from '../environments/environment';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { httpInterceptor } from './shared/http.interceptor';

function configureAuth(authenticationService: AuthenticationService) {
  return () => authenticationService.configureAuth(environment.authorityApiUrl);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    provideOAuthClient({
      resourceServer: {
        allowedUrls: [environment.coreApiUrl],
        sendAccessToken: true,
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      multi: true,
      deps: [AuthenticationService],
    },
    AuthorityApiModule,
    {
      provide: AuthorityConfiguration,
      useFactory: () =>
        new AuthorityConfiguration({
          basePath: environment.authorityApiUrl,
          withCredentials: true,
        }),
    },
    CoreApiModule,
    {
      provide: CoreConfiguration,
      useFactory: () =>
        new CoreConfiguration({
          basePath: environment.coreApiUrl,
        }),
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
  ],
};
