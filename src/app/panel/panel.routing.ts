import { Routes } from '@angular/router';
import { PanelComponent } from './panel.component';
import { UsersComponent } from './users/users.component';
import { ErrorPageComponent } from './error-page/error-page.component';

export const PanelRoutes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error' },
];
