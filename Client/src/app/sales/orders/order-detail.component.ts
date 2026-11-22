import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';

import { ApiClientService, Util } from '../../../common/core';
import { Customer } from '../sales';
import { Order } from '../sales';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ShowOrderDialog } from './reports/show-order.modal';
import { ShowTicketDialog } from './reports/show-ticket.modal';

@Component({
    selector: 'order-detail',
    templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {

    @ViewChild('ticketTab') ticketTab: any;
    order: Order;
    id: string;
    backto: string[]=['/sales/orders'];
    customer_id: any;
    customer: Customer;
    customers: any[];
    events: any;
    event_id: any;

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router,
        private dialog: MatDialog
    ) { }

    getOrder(id:string):  Observable<any> {
        return this.ApiClient.pGet("orders/" + this.id, {include:['Customer']}).pipe(take(1))
        .pipe(map((res: any) => {
            this.order = res;
        }));
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.customer_id = this.route.snapshot.queryParams["customer_id"];
        this.event_id = this.route.snapshot.queryParams["event_id"];
        this.getLookups().subscribe(res=>{
            if (this.id === 'add') {
                this.order = new Order();
                this.order.createdAt = moment().toDate();
                if(this.customer_id){
                    this.backto = ['/sales/customers',this.customer_id];
                    this.order.CustomerID = this.customer_id;
                } 
                if(this.event_id){
                    this.backto = ['/sales/events',this.event_id];
                    this.order.EventID = this.event_id;
                    this.eventChanged(this.event_id);
                } 
            }
            else {
                this.getOrder(this.id)
                    .subscribe(res => {
                        if(this.customer_id){
                            this.backto = ['/sales/customers',this.customer_id];
                        } 
                        if(this.event_id){
                            this.backto = ['/sales/events',this.event_id];
                        } });
            }
        });
    }
    getCustomerByID(): Observable<any> {
        return this.ApiClient.pGet(`customers/${this.customer_id}`, {}).pipe(take(1))
        .pipe(map((res: any) => {
            this.customer = res;
        }));
    }

    getLookups(): Observable<any> {
        return forkJoin([
            this.ApiClient.pGet("customers", {pageSize:this.util.MaxPageSize(), select:"ID,FirstName,LastName,FullName"}).pipe(take(1)),
            this.ApiClient.pGet("events", {pageSize:this.util.MaxPageSize(), select:"ID,EventName"}).pipe(take(1))
        ])
        .pipe(map((res: any) => {
            this.customers = res[0].rows;
            this.events = res[1].rows;
        }));
    }

    add(frm:any): void {
        this.ApiClient.pPost("orders", {}, this.order).pipe(take(1))
            .subscribe(res => {
                this.order = res;
                this.id = this.order.ID.toString();
                //this.router.navigate(this.backto);
                this.util.alert("success", "Success Adding Order", false, { icon: 'check' }, true);
                this.router.navigate(['/sales/orders', this.id ]);
                this.getOrder(this.id)
                    .subscribe(res => { });
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }

    save(frm:any): void {
        this.ApiClient.pPut("orders/" + this.id, {}, this.order).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(this.backto);
                this.util.alert("success", "Success Saving Order", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }
    useDateChanged(evt:object): void {
        let uDate = moment(evt);
        this.order.useDate = uDate.toDate();
        this.order.pickUpDate = uDate.clone().subtract(1,'days').toDate();
        this.order.returnDate = uDate.clone().add(1,'days').toDate();
    }
    actualReturnDateChanged(evt:Date): void {
        let uDate = evt;
        this.order.actualReturnDate = evt;
    }
    eventChanged(evt:number): void {
        let event_id = evt;
        this.ApiClient.pGet("events/" + event_id, {}).pipe(take(1))
            .subscribe(res => this.useDateChanged(res.eventDate));
        this.order.EventID = event_id;
    }
    listChange(evt:any): void {
        this.getOrder(this.id)
            .subscribe(res => {});
    }

    print(id:string): void {
        const dialogRef = this.dialog.open(ShowOrderDialog, {
                width:'250px',data:{id:id},disableClose:true
        });
        dialogRef.afterClosed().subscribe(res=>{});

    }
    printTicket(id:string): void {
        const dialogRef = this.dialog.open(ShowTicketDialog, {
                width:'250px',data:{id:id},disableClose:true
        });
        dialogRef.afterClosed().subscribe(res=>{});

    }
    close(): void {
    }
}