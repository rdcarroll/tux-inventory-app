import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from '../../common/core';

import { ReportsComponent } from './reports.component';
import { itemhistoryComponent } from './itemhistory/itemhistory.component';
import { statusComponent } from './status/status.component';
import { currentlypulledComponent } from './currentlypulled/currentlypulled.component';
import { currentlyoutComponent } from './currentlyout/currentlyout.component';

const routes: Routes = [
    {
        path: 'reports', component: ReportsComponent, canActivate: [AuthGuard, AdminGuard],
        children: [
            { path: 'itemhistory', component: itemhistoryComponent },
            { path: 'status', component: statusComponent },
            { path: 'currentlypulled', component: currentlypulledComponent },
            { path: 'currentlyout', component: currentlyoutComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    //exports: [RouterModule]
})
export class ReportsRoutingModule { }
