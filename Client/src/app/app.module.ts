import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './../common/core/core.module';
import { SharedModule } from './../common/shared/shared.module';

import { HomeComponent } from './home/home.component';

import { AdminModule } from './admin/admin.module';
import { SalesModule } from './sales/sales.module';
import { ReportsModule } from './reports/reports.module';


@NgModule({
    imports: [
        CoreModule,
        SharedModule, //needed here for app and home components
        AdminModule,
        SalesModule,
        ReportsModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
