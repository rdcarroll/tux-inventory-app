import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../../common/core';
import { Order } from '../../sales';
import { forkJoin, Observable } from 'rxjs';
import * as moment from 'moment';
import * as root from '../../../../environments/environment';

@Component({
    selector: 'order-print',
    templateUrl: './order-print.component.html'
})
export class OrderPrintComponent implements OnChanges {

    @Input() id: string;
    @Output() action : EventEmitter<boolean> = new EventEmitter<boolean>();
    order: any;
    total: any;
    now: Date = new Date();  
    assetPath: string;
    company: any;

    constructor(
        private ApiClient: ApiClientService
    ) { 
        this.assetPath = root.assetpath;}

    getLookups(id:string): Observable<any> {
        return forkJoin([
            this.ApiClient.pGet("companies/1", {}).pipe(take(1)),
            this.ApiClient.pGet("orders/" + this.id, {include:['Customer','OrderTickets']}).pipe(take(1))
        ])
        .pipe(map((res: any) => {
            this.company = res[0];
            this.order = res[1];
        }));
    }
    getOrderItems(id:string): Observable<any> {
        let q = {include:['InventoryItem',{'Inventory':['InventoryType']}], orderby:"Inventory.InventoryType.Rank|asc"}
        return this.ApiClient.pGet(`orders/${id}/order_items`, q).pipe(take(1)).pipe(map((res2: any) => {
            this.order.OrderItems = res2;
            this.total = 0;
            //dont use the default holders
            //this.order.OrderItems = this.order.OrderItems.filter((el:any) => el.Inventory.Description !== "holder");
            this.order.OrderItems.forEach((item:any)=>{
                this.total += item.Cost||0;
            });
        }));
    }
    ngOnChanges(): void {
        if(this.id){
            this.getLookups(this.id)
                .subscribe({
                    next: res => {
                        this.getOrderItems(this.id)
                            .subscribe({
                                next: res => {
                                    setTimeout(() => {
                                        this.action.emit(true);
                                    }, 500);
                                },
                                error: err => {
                                    this.action.emit(false);
                                }
                            });
                    },
                    error: err => {
                        this.action.emit(false);
                    }
                });
        }
    }
}