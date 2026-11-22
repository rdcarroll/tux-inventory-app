import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from '../../common/core';

import { SalesComponent } from './sales.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail.component';
import { customersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customers/customer-detail.component';
import { eventsComponent } from './events/events.component';
import { eventDetailComponent } from './events/event-detail.component';

const routes: Routes = [
    {
        path: 'sales', component: SalesComponent, canActivate: [AuthGuard, AdminGuard],
        children: [
            { path: 'orders', component: OrdersComponent },
            { path: 'orders/:id', component: OrderDetailComponent } ,
            { path: 'customers', component: customersComponent },
            { path: 'customers/:id', component: CustomerDetailComponent },
            { path: 'events', component: eventsComponent },
            { path: 'events/:id', component: eventDetailComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    //exports: [RouterModule]
})
export class SalesRoutingModule { }