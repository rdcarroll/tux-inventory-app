import { NgModule } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';

import { SalesRoutingModule } from './sales-routing.module';

import { SalesComponent } from './sales.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail.component';
import { OrderItemsComponent } from './orders/order-items.component';
import { OrderItemEditComponent } from './orders/order-item-edit.component';
import { OrderTicketComponent } from './orders/order-ticket.component';
import { OrderPaymentComponent } from './orders/order-payment.component';
import { customersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customers/customer-detail.component';
import { eventsComponent } from './events/events.component';
import { eventDetailComponent } from './events/event-detail.component';
import { inandoutComponent } from './inandout/inandout.component';
import { OrderPrintComponent } from './orders/reports/order-print.component';
import { EventPrintComponent } from './inandout/reports/event-print.component';
import { ShowOrderDialog } from './orders/reports/show-order.modal';
import { ShowEventDialog } from './inandout/reports/show-event.modal';
import { sizesComponent } from './sizes/sizes.component';
import { TicketPrintComponent } from './orders/reports/ticket-print.component';
import { ShowTicketDialog } from './orders/reports/show-ticket.modal';

//import { AppConnector, Application, Building, Company, Database, Department, Domain, Group, Server, Site } from './sitedata';

@NgModule({
    imports: [
        SharedModule,
        SalesRoutingModule
    ],
    declarations: [
        SalesComponent,
        OrdersComponent,
        OrderDetailComponent,
        OrderItemsComponent,
        OrderItemEditComponent,
        OrderTicketComponent,
        OrderPaymentComponent,
        customersComponent,
        CustomerDetailComponent,
        eventsComponent,
        eventDetailComponent,
        inandoutComponent,
        sizesComponent,
        OrderPrintComponent,
        EventPrintComponent,
        ShowOrderDialog,
        ShowEventDialog,
        TicketPrintComponent,
        ShowTicketDialog
    ],
    //entryComponents: [ShowOrderDialog,ShowEventDialog,ShowTicketDialog]
})
export class SalesModule { }