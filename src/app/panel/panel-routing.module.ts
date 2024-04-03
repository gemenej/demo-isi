import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel.component';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const PanelRoutes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/create',
        component: CreateUserComponent,
        children: [
          { path: '', redirectTo: 'users/create', pathMatch: 'full' },

        ],
      },
      {
        path: 'users/update/:user_id',
        component: UpdateUserComponent,
        children: [
          { path: '', redirectTo: 'users/update', pathMatch: 'full' },
        ],
      },
    ],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error' },
];

@NgModule({
  imports: [RouterModule.forChild(PanelRoutes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
