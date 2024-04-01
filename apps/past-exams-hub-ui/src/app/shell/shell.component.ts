import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { CurrentUserService } from '../shared/services/current-user.service';
import { CommonModule } from '@angular/common';
interface MenuItem {
  text: string;
  iconName: string;
  url: string;
}

@Component({
  selector: 'pastexamshub-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    AsyncPipe,
    CommonModule,
  ],
})
export class ShellComponent {
  private authenticationService = inject(AuthenticationService);
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  currentUser = this.currentUserService.currentUser;

  constructor(private currentUserService: CurrentUserService) {}
  readonly menuItems: MenuItem[] = [
    {
      text: 'Početna',
      iconName: 'home',
      url: '/pocetna',
    },
    {
      text: 'Blanketi',
      iconName: 'assignment',
      url: '/blanketi',
    },
    {
      text: 'Predmeti',
      iconName: 'auto_stories',
      url: '/predmeti',
    },
    {
      text: 'Rokovi',
      iconName: 'event',
      url: '/rokovi',
    },
    {
      text: 'Studenti',
      iconName: 'group',
      url: '/studenti',
    },
    {
      text: 'Profesori',
      iconName: 'supervisor_account',
      url: '/profesori',
    },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  addBlanket() {
    this.router.navigate(['dodaj_blanket']);
  }

  profile() {
    this.router.navigate(['profil']);
  }

  logout() {
    this.authenticationService.logout();
  }
}
