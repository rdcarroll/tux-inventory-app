import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';

import {  ApiClientService, Util } from '../../../common/core';
import { Customer } from '../sales';
import { Order, OrderItem } from '../sales';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'order-item-edit',
    templateUrl: './order-item-edit.component.html'
})
export class OrderItemEditComponent implements OnInit,OnChanges {
    
    @Input() item: any;
    @Output() itemChange = new EventEmitter<object>();
    @Output() closeEdit = new EventEmitter<boolean>();
    inventory_types: any[];
    inventory: any[];
    inventory_itemsizes: any[];
    invtypeid: number;
    invmodelid: number;
    invitemid: number;
    price: number;

    statusid: number;
    invmodeldesc: any;
    confirmed: any;
    itemsize: any;

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { 
    }

    changeInventoryType(inventoryTypeID:number, initChild:boolean){
         this.getInventory(inventoryTypeID).subscribe(res=>{
             let useIncoming = initChild && this.invmodeldesc !== "holder";
            this.invmodelid = useIncoming ? this.invmodelid : (res[0] ? res[0].ID : null);
             this.changeInventory(this.invmodelid, initChild);
        });
    }
    changeInventory(inventoryID:number, initChild:boolean){
        let useIncoming = initChild && this.invmodeldesc !== "holder";
        let inv = this.inventory.filter(inv => {  return inv.ID == inventoryID   })[0] || {};
        let nCost = inv.Cost==null || inv.Cost==0 ? inv.InventoryType.Cost : inv.Cost;
        this.price = useIncoming ? this.price : nCost;
        this.invmodeldesc =  initChild ? this.invmodeldesc : inv.Description;
         this.getInventoryItemSizes(inventoryID).subscribe(res=>{
            //this.invitemid = initChild?this.invitemid : (res[0] ? res[0].ID : null);
            this.itemsize = useIncoming ? this.itemsize : (res[0] ? res[0].ItemSize : null);
        });
    }
    changeInventoryItem(){
        
    }

    getInventoryTypes(): Observable<any> {
        return this.ApiClient.pGet(`inventory_types`, {pageSize:this.util.MaxPageSize()}).pipe(take(1))
        .pipe(map((res: any) => {
            this.inventory_types = res;
        }));
    }
    //models/styles
    getInventory(inventoryTypeID:number): Observable<any> {
        let q = {include:['InventoryType'],filter:`InventoryTypeID|${inventoryTypeID},ModelName|!"default"`,pageSize:this.util.MaxPageSize()}
        return this.ApiClient.pGet(`inventory`, q).pipe(take(1))
        .pipe(map((res: any) => {
            return this.inventory = res.rows;
        }));
    }
    getInventoryItemSizes(inventoryID:number): Observable<any> {
        let q = {pageSize:this.util.MaxPageSize(),OrderItemID:this.item.ID}
        return this.ApiClient.pGet(`inventory/${inventoryID}/sizes`, q).pipe(take(1))
        .pipe(map((res: any) => {
            return this.inventory_itemsizes = res;
        }));
    }
    ngOnChanges(): void {
        this.invtypeid = this.item.Inventory.InventoryType.ID;
        this.invmodelid =  this.item.Inventory.ID;
        this.invmodeldesc =  this.item.Inventory.Description;
        //this.invitemid =  this.item.InventoryItem.ID;
        this.itemsize = this.item.ItemSize;
        //this.statusid =  this.item.InventoryItem.StatusID;
        this.price = this.item.Cost || 0;
        //this.confirmed =  this.item.Confirmed;

        this.getInventoryTypes().subscribe(res=>{
            this.changeInventoryType(this.invtypeid, true);
        });
    }
    ngOnInit(): void {
    }
    
    save(): void {
        let nObject = {
            orderid:this.item.ID,
            invmodelid: this.invmodelid,
            //invitemid :  this.invitemid,
            price : this.price,
            //confirmed :  this.confirmed,
            itemsize : this.itemsize
        }
        let invitemsize = this.inventory_itemsizes.filter(invitemsize => {  return invitemsize.ItemSize == this.itemsize   })[0] || {};
        if(invitemsize && invitemsize.overbooked){
            if (confirm("The Inventory Size you selected seems to be overbooked for some of the dates in this Order. Save Anyway?")) {
                this.itemChange.emit(nObject);
            }
        }
        else{
            this.itemChange.emit(nObject);
        }
    }
    close(): void {
            this.closeEdit.emit(true);
    }
}