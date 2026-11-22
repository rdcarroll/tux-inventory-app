import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OrderItem } from '../sales';
//import { identifierModuleUrl } from '@angular/compiler';
import { ShowEventDialog } from './reports/show-event.modal';
import { ShowOrderDialog } from '../orders/reports/show-order.modal';

@Component({
    selector: 'my-inandout',
    templateUrl: './inandout.component.html'
})
export class inandoutComponent implements OnInit {
    @Input() mode : string = "pull";
    @Input() orderid : number;
    @Input() orderitemid : number;
    @Output() itemChange = new EventEmitter<object>();
    @Output() closeEdit = new EventEmitter<boolean>();
    dialogRef: any;
    order_items: any[];
    order: any;
    hasItemsToPickup: boolean;
    hasItemsToReturn: boolean;
    barcodes: any;


    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {
    }

    getInventoryItems(orderid:number): Observable<any> {
        let q = {include:['InventoryItem',{'Inventory':['InventoryType']}]}
        return this.ApiClient.pGet(`orders/${orderid}/order_items`, q).pipe(take(1),map((res: any) => {
            this.order_items = res;
        }));
    }
    onBarcodeFocus(item:any): void {
        let q = {filter:`InventoryID|${item.InventoryID},Size|'${item.ItemSize}'`}
        this.ApiClient.pGet(`inventory_items`, q).pipe(take(1))
        .subscribe(res=>{
            this.barcodes = res.rows;
        });
    }
    changeBarcode(item:any): any {
        this.barcodes = [];
        // let q = {InventoryID:item.InventoryID,ItemSize:item.ItemSize}
        // return this.ApiClient.pGet(`inventory_items`, q).pipe(take(1),map((res: any) => {
        //     this.barcodes = res;
        // }));

    }
    getOrderItems(orderid:number): Observable<any> {
        let q = {include:['InventoryItem',{'Inventory':['InventoryType']}], orderby:"Inventory.InventoryType.Rank|asc"}
        return this.ApiClient.pGet(`orders/${orderid}/order_items`, q).pipe(take(1),map((res: any) => {
            this.order_items = res;
        }));
    }
    getOrder(orderid:number): Observable<any> {
        let q = {include:['Customer']}
        return this.ApiClient.pGet(`orders/${orderid}`, q).pipe(take(1),map((res: any) => {
            this.order = res;
        }));
    }
    
    save(orderitem:OrderItem, action:string, parms?:any): void {
        parms = parms || {};
        this.ApiClient.pPut(`order_items/${orderitem.ID}/${action}`, parms, orderitem).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Success Saving Order", false, { icon: 'check' }, true);
                this.getOrderItems(this.orderid).subscribe(res=>{
                });
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });

    }
    pull(template: TemplateRef<any>) {
        this.getOrder(this.orderid).subscribe(res=>{
            this.getOrderItems(this.orderid).subscribe(res=>{
                this.dialogRef = this.dialog.open(template, {
                  width: '80%'
                });
                this.dialogRef.afterClosed().subscribe((result: any) => {
                    this.closeEdit.emit(true);
                  });
            });
        });
      }
      pullChange(item:any,evt:{ barcode: string; scanned: boolean; }) {
        if(!evt.scanned)return;
        let newbarcode = evt.barcode;
        item.notfound = false;
        if(newbarcode && item.InventoryItemID==null){
            let q = {filter:`Barcode|'${newbarcode}',Size|'${item.ItemSize}',InventoryID|${item.InventoryID}`}
            this.ApiClient.pGet(`inventory_items`, q).pipe(take(1)).subscribe(res=>{
                if(res.count==0){
                    //alert("The barcode does not match an Inventory Item for the model and size selected.");
                    item.notfound = true;
                }
                else {
                    let ii = res.rows.filter((invitem:any) => {  return invitem.Barcode == newbarcode   })[0] || {};
                    item.InventoryItemID = ii.ID;
                    item.notfound = false;
                    this.save(item,'pull');
                }
            });
        }
        else if(item.InventoryItemID){
            alert("Please use the Returns to remove this item.");
            this.getOrderItems(this.orderid).subscribe(res=>{
            });
        }
        
    }
        
    pickup(template: TemplateRef<any>) {
        this.getOrder(this.orderid).subscribe(res=>{
            this.getOrderItems(this.orderid).subscribe(res=>{
                this.hasItemsToPickup = this.order_items.some((ele)=>ele.pulledDate!=null);
                this.dialogRef = this.dialog.open(template, {
                  width: '80%'
                });
                this.dialogRef.afterClosed().subscribe((result: any) => {
                    this.closeEdit.emit(true);
                  });
            });
        });
      }
      pickupSave() {
        this.ApiClient.pPut(`orders/${this.orderid}/pickup`, {}, {}).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Success Picking Up Order", false, { icon: 'check' }, true);
                this.closeEdit.emit(true);
            }, (err) => {
                this.util.handleError(err, "Error Picking Up Order");
            });
        }


    return(template: TemplateRef<any>) {
        this.getOrder(this.orderid).subscribe(res=>{
            this.getOrderItems(this.orderid).subscribe(res=>{
                this.hasItemsToReturn = this.order_items.some((ele)=>ele.pulledDate!=null);
                this.dialogRef = this.dialog.open(template, {
                  width: '80%'
                });
                this.dialogRef.afterClosed().subscribe((result: any) => {
                    this.closeEdit.emit(true);
                  });
            });
        });
      }
    returnChange(item:any,evt:{ barcode: string; scanned: boolean; }) {
        if(!evt.scanned)return;
        item.notfound=false;
        let returnbarcode = evt.barcode;
        if(returnbarcode && item.InventoryItem && item.InventoryItem.Barcode == returnbarcode){
            if(item.pickedupDate){
                this.save(item,'return');
            }
            else{
                if (confirm("This item has not been picked up yet. Do you want to return it to the shelf?")) {
                    this.save(item,'return',{remove:true});
                }
                else{
                    item.returnbarcode = null;
                }
            }
        }
        else if(returnbarcode && item.InventoryItem && item.InventoryItem.Barcode != returnbarcode){
            item.notfound=true;
        }
    }

    ngOnChanges(): void {
        
    }

    ngOnInit(): void {

    }
    print(id:number): void {
        // const dialogRef = this.dialog.open(ShowEventDialog, {
        //         width:'250px',data:{id:id,mode:this.mode},disableClose:true
        // });
        // dialogRef.afterClosed().subscribe(res=>{});

        const dialogRef = this.dialog.open(ShowOrderDialog, {
            width:'250px',data:{id:id},disableClose:true
    });
    dialogRef.afterClosed().subscribe(res=>{});
    }
}
