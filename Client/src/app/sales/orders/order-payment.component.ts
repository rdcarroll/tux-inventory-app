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
    selector: 'order-payment',
    templateUrl: './order-payment.component.html'
})
export class OrderPaymentComponent implements OnInit, OnChanges  {
    
    @Input() ticketID: any;
    @Output() paymentChange = new EventEmitter<object>();
    user: CurrentUser;
    payments: any;
    reasons: any;
    reasonid: number;
    amount:number;



    constructor(
        private ApiClient: ApiClientService,
        private security: SecurityService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { 
    }


    getPaymentReasons(): Observable<any> {
        return this.ApiClient.pGet(`payment_reasons`, {}).pipe(take(1))
        .pipe(map((res: any) => {
            this.reasons = res;
        }));
    }
    getTicketPayments(TicketID:number): Observable<any> {
        let q = {filter:`TicketID|${TicketID}`,include:['Reason']}
        return this.ApiClient.pGet(`ticket_payments`, q).pipe(take(1))
        .pipe(map((res: any) => {
            if(res){
                this.payments = res;
            }
        }));
    }
    ngOnChanges(): void {
        if(this.ticketID){
            this.getTicketPayments(this.ticketID).subscribe(res=>{
                
            });
        }
    }
    ngOnInit(): void {
        this.user = this.security.getUser();
        this.getPaymentReasons().subscribe(res=>{
            if(this.reasons?.length > 0) this.reasonid = this.reasons[0].ID
        });
    }
    
    btnClick(item:any,stype:string): void {
        switch(stype){
            case 'save':{
                break;
            }
            case 'delete':{
                if (confirm("Are you sure?")) {
                    this.remove(item.ID)
                }
                break;
            }
        }
    }
    amountChanged(amount:number): void {
        this.save(amount);
    }
    save(namount:number): void {
        if(this.reasonid && namount){
            let nObject = {
                TicketID:this.ticketID,
                ReasonID:this.reasonid,
                Amount :  namount
            }
            this.ApiClient.pPost("ticket_payments", {}, nObject).pipe(take(1))
                .subscribe(res => {
                    this.util.alert("success", "Success Adding Payment", false, { icon: 'check' }, false);
                    this.paymentChange.emit(res);
                    if(this.reasons?.length > 0) this.reasonid = this.reasons[0].ID
                    this.amount=0;
                }, (err) => {
                    this.util.handleError(err, "Error Saving");
                });
        }
    }
    
    remove(id: number): void {
        this.ApiClient.pRemove("ticket_payments/" + id, {}).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Payment was successfully removed.", false, { icon: 'check' }, true);
                this.paymentChange.emit(res);
            }, (err) => {
                this.util.handleError(err, "Error Removing");
            });
    }

}