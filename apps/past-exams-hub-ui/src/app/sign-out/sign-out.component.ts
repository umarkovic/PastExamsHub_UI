import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@org/authority/data-access';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'pastexamshub-sign-out',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthenticationService],
})
export class SignOutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authenticationService = inject(AuthenticationService);

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        filter((params) => !!params.get('logoutId')),
        map((params) => params.get('logoutId') as string),
        switchMap((logoutId) => {
          return this.authenticationService.authenticationSignOutPost({
            logoutId,
          });
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
