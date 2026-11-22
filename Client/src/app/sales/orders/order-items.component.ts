import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';

import { SecurityService, CurrentUser, ApiClientService, Util } from '../../../common/core';
import { InventoryType } from '../../admin';
import { Customer } from '../sales';
import { Order, OrderItem } from '../sales';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'order-items',
    templateUrl: './order-items.component.html'
})
export class OrderItemsComponent implements OnInit, OnChanges {
    
    @Input() order: Order;
    @Output() listChange = new EventEmitter<object>();
    orderitems: OrderItem[];
    inventory_types: InventoryType[];
    user: CurrentUser;
    package_id: any;
    packages: any[];
    total: number = 0;

    constructor(
        private ApiClient: ApiClientService,
        private security: SecurityService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { 
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(this.order.ID){
            this.getLookups().subscribe(res=>{
                this.getOrderItems().subscribe(res=>{
                    this.total=0;
                    this.orderitems = res;
                    this.orderitems.forEach((item)=>{this.total += item.Cost||0;});
                });
            });
        }
    }


    getOrderItems(): Observable<any> {
        let q = {include:['InventoryItem',{'Inventory':['InventoryType']}], orderby:"Inventory.InventoryType.Rank|asc"}
        return this.ApiClient.pGet(`orders/${this.order.ID}/order_items`, q).pipe(take(1));
    }
    ngOnInit(): void {
        this.user = this.security.getUser();
        
        // this.getLookups().subscribe(res=>{
        //     this.getOrderItems().subscribe(res=>{
        //         this.orderitems = res;
        //     });
        // });
    }
    getLookups(): Observable<any> {
        return forkJoin([this.ApiClient.pGet("inventory_types", {}).pipe(take(1)),
        this.ApiClient.pGet("packages", {}).pipe(take(1))])
        .pipe(map((res: any) => {
            this.inventory_types= res[0];
            this.packages = res[1];
        }));
    }
 
    btnClick(item:any,stype:string): void {
        switch(stype){
            case 'close':
            case 'edit':{
                let wasEditing = item.$$editing;
                for (let _item of this.orderitems) {
                    _item.$$editing = false; 
                }
                item.$$editing=!wasEditing;
                break;
            }
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
    packageChanged(package_id:number): void {
        if(package_id){
            if (confirm("Items will be replaced with the items from this selected package. Continue?")) {
            this.ApiClient.pPut(`orders/${this.order.ID}/order_items`, {package_id:package_id}, this.order).pipe(take(1))
            .subscribe(res => {
                this.listChange.emit(res);
                // this.getOrderItems().subscribe(res=>{
                //     this.orderitems = res;
                // });
                this.util.alert("success", "Success Replacing Order Items", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
            }
        }
    }
    addItemClicked(): void {        
        let nOrderItem:any = {
            OrderID: this.order.ID,
            CustomerID: this.order.CustomerID,
            //EmployeeID: number;
            //Confirmed: 0,
            //InventoryItemID: null,
            Cost: 0
        }
        this.ApiClient.pPost(`order_items`, {order_id:this.order.ID}, nOrderItem).pipe(take(1))
            .subscribe(res => {
                this.listChange.emit(res);
                // this.getOrderItems().subscribe(res=>{
                //     this.orderitems = res;
                // });
                this.util.alert("success", "Success Adding Order Item", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

    save(orderitem:OrderItem, frm:any): void {
        //orderitem.InventoryItemID = frm.invitemid;
        orderitem.InventoryID = frm.invmodelid;
        orderitem.ItemSize = frm.itemsize;
        orderitem.Cost = frm.price;
        //orderitem.Confirmed = frm.confirmed;
        this.ApiClient.pPut("order_items/" + orderitem.ID, {}, orderitem).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Success Saving Order", false, { icon: 'check' }, true);
                this.listChange.emit(res);
                // this.getOrderItems().subscribe(res=>{
                //     this.orderitems = res;
                // });
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });

    }
    remove(id: number): void {
        this.ApiClient.pRemove("order_items/" + id, {}).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Order Item was successfully removed.", false, { icon: 'check' }, true);
                this.listChange.emit(res);
                // this.getOrderItems().subscribe(res=>{
                //     this.orderitems = res;
                // });
            }, (err) => {
                this.util.handleError(err, "Error Removing");
            });
    }

}