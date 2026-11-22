import { NgModule } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';

import { ReportsRoutingModule } from './reports-routing.module';

import { ReportsComponent } from './reports.component';
import { itemhistoryComponent } from './itemhistory/itemhistory.component';
import { statusComponent } from './status/status.component';
import { currentlypulledComponent } from './currentlypulled/currentlypulled.component';
import { currentlyoutComponent } from './currentlyout/currentlyout.component';

@NgModule({
    imports: [
        SharedModule,
        ReportsRoutingModule
    ],
    declarations: [
        ReportsComponent,
        itemhistoryComponent,
        statusComponent,
        currentlypulledComponent,
        currentlyoutComponent
    ]
})
export class ReportsModule { }