import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';

import {  ApiClientService, CurrentUser, SecurityService, Util } from '../../../common/core';
import { InventoryType } from '../../admin';
import { Customer } from '../sales';
import { Order, OrderItem } from '../sales';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'order-ticket',
    templateUrl: './order-ticket.component.html'
})
export class OrderTicketComponent implements OnInit, OnChanges  {
    
    @Input() order: Order;
    @Output() ticketChange = new EventEmitter<object>();
    user: CurrentUser;
    order_tickets: any;
    subtotal:number;
    tax:number;
    total:number;
    paid:number;
    adjustment:number;
    balancedue:number;
    ticketnumber: any;
    customername: any;
    createddate: any;
    ticketitems: any[];


    constructor(
        private ApiClient: ApiClientService,
        private security: SecurityService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { 
    }

    getOrderItems(OrderID:number): Observable<any> {
        let q = {include:[{'InventoryItem':[{'Inventory':['InventoryType']}]}]}
        return this.ApiClient.pGet(`orders/${OrderID}/order_items`, q).pipe(take(1))
        .pipe(map((res: any) => {
            this.ticketitems = res;
        }));
    }

    getOrderTickets(OrderID:number): Observable<any> {
        let q = {filter:`OrderID|${OrderID}`,include:['Customer']}
        return this.ApiClient.pGet(`order_tickets`, q).pipe(take(1))
        .pipe(map((res: any) => {
            if(res){
                
                let myticket = res[0] || {Customer:null};
                this.ticketnumber = myticket.ID || "No Ticket Found";
                this.customername = myticket.Customer.FullName || "No Customer Found";
                this.createddate = myticket.createdAt || null;
                
                this.subtotal = myticket.SubTotal || 0;
                this.tax = myticket.Tax || 0;
                this.total = myticket.Total || 0;
                this.adjustment = myticket.Adjustment || 0;
                this.paid = myticket.Paid || 0;
                this.balancedue = myticket.Balance || 0;
            }
        }));
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(this.order.ID){
            let orderID = this.order.ID;
            this.getOrderTickets(orderID).subscribe(res=>{
                this.getOrderItems(orderID).subscribe(res=>{
                    //this.ticketitems = res;
                });
            });
        }
    }
    ngOnInit(): void {
        this.user = this.security.getUser();
        // this.getOrderTickets(this.order.ID).subscribe(res=>{
            
        // });
    }
    
    paymentChanged(evt:any): void {
        this.ticketnumber=null;
        this.ticketChange.emit(evt);
    }
    close(): void {
        
    }

    adjustmentChanged(adjustment:number): void {
        this.ApiClient.pPut("order_tickets/" + this.ticketnumber, {}, {Adjustment:adjustment}).pipe(take(1))
            .subscribe(res => {
                //this.util.alert("success", "Success Saving Adjustment", false, { icon: 'check' }, true);
                this.ticketChange.emit(res);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }
}