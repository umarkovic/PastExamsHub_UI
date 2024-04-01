import { Injectable } from '@angular/core';
import { CurrentUser } from '../models/current-user.model';
import { StorageKeys } from '../constants/storage-keys';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  get currentUser() {
    const token = localStorage.getItem(
        StorageKeys.ACCESS_TOKEN_KEY
    ) as string;
    const decodedToken = this.parseJwt(token);
    return decodedToken as CurrentUser;
  }
}
