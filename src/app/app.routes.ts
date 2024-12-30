import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/pages/library-page/library-page.component').then(m => m.LibraryPageComponent),

  },
  {
    path: 'track/:id',
    loadComponent: () =>
      import('./features/track/pages/track-page/track-page.component').then(m => m.TrackPageComponent),

  },
  { path: '', redirectTo: 'library', pathMatch: 'full' },
  { path: '**', redirectTo: 'library' },
];
