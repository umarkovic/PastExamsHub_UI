import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pastexamshub-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  async ngOnInit() {
    const isAuthenticated =
      await this.authenticationService.loadDiscoveryDocumentAndLogin();
    if (isAuthenticated) {
       this.router.navigate([`/pocetna`]);
      /* this.usersService
        .usersSignInPost({ timeZone: DateTime.local().zoneName as string })
        .subscribe(); */
    }
  }
}
