export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './password.service';
import { PasswordService } from './password.service';
export const APIS = [AuthenticationService, PasswordService];
