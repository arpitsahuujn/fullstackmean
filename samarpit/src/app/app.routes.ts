import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UsersComponent } from './features/users/users.component';
import { ClientsComponent } from './features/clients/clients.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { PagenotfoundComponent } from './features/pagenotfound/pagenotfound.component';
import { AuthComponent } from './features/auth/auth.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ClientOverviewComponent } from './features/clients/client-overview/client-overview.component';
import { UserOverviewComponent } from './features/users/user-overview/user-overview.component';
import { authGuard } from './core/guards/auth.guard';
import { ClientProfileComponent } from './features/client-profile/client-profile.component';
import { ClientDocumentsComponent } from './features/client-profile/client-documents/client-documents.component';

export const routes: Routes = [
    { path: '', redirectTo: 'authlayout/auth', pathMatch: 'full' },
    {
        path: 'authlayout',
        component: AuthLayoutComponent,
        children: [
            { path: 'auth', title: 'auth', component: AuthComponent },
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', title: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
            // { path: 'users', title: 'users', component: UsersComponent },
            // { path: 'users/:id', component: UserOverviewComponent },
            {
                path: 'users', canActivate: [authGuard], children: [ // this is not nested routing it uses current level <router-outlet/>
                    { path: '', component: UsersComponent },
                    { path: ':id/overview', component: UserOverviewComponent },
                ]
            },
            {
                path: 'clients', canActivate: [authGuard], children: [ // this is not nested routing it uses current level <router-outlet/>
                    { path: '', component: ClientsComponent },
                    { path: ':id/overview', component: ClientOverviewComponent },
                ]
            },
            {
                path: 'cltprofile', canActivate: [authGuard], title: 'client profile', component: ClientProfileComponent,
                children: [
                    { path: 'clientdoc', component: ClientDocumentsComponent }
                ]
            },
            { path: 'aboutus', title: 'aboutus', component: AboutUsComponent },
        ]
    },
    { path: '**', component: PagenotfoundComponent } // Wildcard route for a 404 page
];
















// export const routes: Routes = [
//     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//     {
//         path: 'dashboard',
//         loadComponent: () =>
//             import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
//     },
//     {
//         path: 'users',
//         loadComponent: () =>
//             import('./features/users/users.component').then(m => m.UsersComponent)
//     },
//     {
//         path: 'clients',
//         loadComponent: () =>
//             import('./features/clients/clients.component').then(m => m.ClientsComponent)
//     },
//     {
//         path: 'aboutus',
//         loadComponent: () =>
//             import('./features/about-us/about-us.component').then(m => m.AboutUsComponent)
//     }
// ];
