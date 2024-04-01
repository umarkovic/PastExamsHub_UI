export interface CurrentUser {
    exp: number;
    iss: string;
    aud: string;
    client_id: string;
    sub: string;
    auth_time: number;
    idp: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
    'AspNet.Identity.SecurityStamp': string;
    name: string;
    email: string;
    email_verified: [string, boolean];
    invite_id: string;
    last_account_status_dateTime_utc: string;
    role: string;
    preferred_username: string;
    phone_number: string;
    phone_number_verified: boolean;
    given_name: string;
    family_name: string;
    sid: string;
    iat: number;
    scope: string[];
    amr: string[];
  }
  