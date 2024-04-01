import { Route } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('../app/sign-in/sign-in.component').then((c) => c.SignInComponent),
    // canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../app/sign-up/sign-up.component').then((c) => c.SignUpComponent),
  },
  {
    path: 'signout',
    loadComponent: () =>
      import('../app/sign-out/sign-out.component').then(
        (c) => c.SignOutComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/shell/shell.component').then((c) => c.ShellComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'pocetna',
        loadComponent: () =>
          import('../app/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'predmeti',
        loadComponent: () =>
          import('../app/subjects/subjects.component').then(
            (c) => c.SubjectsComponent
          ),
      },
      {
        path: 'rokovi',
        loadComponent: () =>
          import('../app/deadlines/deadlines.component').then(
            (c) => c.DeadlinesComponent
          ),
      },
      {
        path: 'studenti',
        loadComponent: () =>
          import('../app/students/students.component').then(
            (c) => c.StudentsComponent
          ),
      },
      {
        path: 'profesori',
        loadComponent: () =>
          import('../app/professors/professors.component').then(
            (c) => c.ProfessorsComponent
          ),
      },

      {
        path: 'profil',
        loadComponent: () =>
          import('../app/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },

      {
        path: 'dodaj_blanket',
        loadComponent: () =>
          import('./add-blanket/add-blanket.component').then(
            (c) => c.AddBlanketComponent
          ),
      },
      {
        path: 'blanketi',
        loadComponent: () =>
          import('./blanket/blanket.component').then((c) => c.BlanketComponent),
      },

      {
        path: 'blanket/:id',
        loadComponent: () =>
          import('./blanket/single-blanket/single-blanket.component').then(
            (c) => c.SingleBlanketComponent
          ),
      },

      {
        path: 'dodaj_resenje/:id',
        loadComponent: () =>
          import('./add-solution/add-solution.component').then(
            (c) => c.AddSolutionComponent
          ),
      },

      {
        path: 'resenje/:id',
        loadComponent: () =>
          import('./solution/solution.component').then(
            (c) => c.SolutionComponent
          ),
      },
    ],
  },

  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path: '**', redirectTo: '/pocetna', pathMatch: 'full' },
];
