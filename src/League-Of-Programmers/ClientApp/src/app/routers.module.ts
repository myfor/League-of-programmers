import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./routers/home/home.module').then(mod => mod.HomeModule),
    pathMatch: 'full',
    data: {preload: true }
  },
  {
    path: 'blogs',
    loadChildren: () => import('./routers/blogs/blogs.module').then(mod => mod.BlogsModule),
    data: { preload: true }
  },
  {
    path: 'login',
    loadChildren: () => import('./routers/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./routers/notifications/notifications.module').then(mod => mod.NotificationsModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./routers/register/register.module').then(mod => mod.RegisterModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./routers/pages/pages.module').then(mod => mod.PagesModule)
  },
  {
    path: 'admin-board',
    loadChildren: () => import('./routers/admin-board/admin-board.module').then(mod => mod.AdminBoardModule),
    canActivate: [AdminGuard]
  },
  {
    path: ':name',
    loadChildren: () => import('./routers/users/users.module').then(mod => mod.UsersModule)
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutesModule { }
