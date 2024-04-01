import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { BlanketService } from './blanket.service';
import { ExamsService } from 'libs/portal/src/api/api';
import { CommonModule } from '@angular/common';
import { CurrentUserService } from '../shared/services/current-user.service';

@Component({
  selector: 'pastexamshub-blanket',
  standalone: true,
  templateUrl: './blanket.component.html',
  styleUrl: './blanket.component.scss',
  imports: [CommonModule, MatButtonModule, MatCardModule],
  providers: [BlanketService, ExamsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlanketComponent {
  lastPage!: string;

  private router = inject(Router);
  data$ = this.route.queryParams.pipe(
    switchMap((x) => {
      const uid = x['uid'];
      this.lastPage = x['lastPage'];
      console.log(this.lastPage);
      return this.blanketService.fetchData(x['lastPage'], uid);
    })
  );

  constructor(
    private route: ActivatedRoute,
    private blanketService: BlanketService
  ) {}

  transformLabel(label: string): string {
    return label
      .split('')
      .map((char, index) => {
        return char.toUpperCase() === char && index !== 0 ? ` ${char}` : char;
      })
      .join('');
  }

  redirectTo(uid: string) {
    this.router.navigate(['/blanket', uid]);
  }
}
