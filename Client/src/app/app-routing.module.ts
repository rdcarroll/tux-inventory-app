import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../common/core';
import { LoginComponent, NauthedComponent } from './../common/shared';

import { HomeComponent } from './home/home.component';
import { NotDoneComponent } from './../common/shared/components/login/notdone.component';


const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'nauthed', component: NauthedComponent },
    { path: 'notdone', component: NotDoneComponent },
    { path: 'landing', component: HomeComponent, canActivate: [AuthGuard] },
    //{ path: '', redirectTo: '/landing', pathMatch: 'full' },

    // otherwise redirect to home
    { path: '**', redirectTo: '/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
    //exports: [RouterModule]
})
export class AppRoutingModule { }