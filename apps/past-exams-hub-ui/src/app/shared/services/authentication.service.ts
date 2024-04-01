import { Injectable, isDevMode } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private oauthService: OAuthService) {}

  async loadDiscoveryDocumentAndLogin() {
    const isAuthenticated =
      await this.oauthService.loadDiscoveryDocumentAndLogin();
    this.oauthService.setupAutomaticSilentRefresh();
    return isAuthenticated;
  }

  logout() {
    from(this.oauthService.revokeTokenAndLogout()).subscribe();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }

  configureAuth(authorityApiUrl: string) {
    this.oauthService.configure({
      showDebugInformation: isDevMode(),

      // Url of the Identity Provider
      issuer: authorityApiUrl,

      // URL of the SPA to redirect the user to after login
      redirectUri: location.origin,
      postLogoutRedirectUri: location.origin,

      // The SPA's id. The SPA is registerd with this id at the auth-server
      clientId: 'Web',
      responseType: 'code',
      useSilentRefresh: true,
      silentRefreshRedirectUri: `${location.origin}/silent-renew.html`,

      // set the scope for the permissions the client should request
      // The first three are defined by OIDC. Last is a usecase-specific one
      scope: 'openid profile offline_access api.access', //email removed

      // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
      // OAuth2-based access_token
      //this.oauthService.oidc = true; // ID_Token

      /* customQueryParams: {
        ClientTenant: 'portal',
      }, */
      revocationEndpoint: `${authorityApiUrl}/connect/revocation`,
      logoutUrl: `${authorityApiUrl}/connect/endsession`,
      silentRefreshTimeout: 60 * 1,
    });
    this.oauthService.setStorage(localStorage);
  }
}
