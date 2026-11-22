import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { InventoryItem } from '../admin';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'inventoryitem-detail',
    templateUrl: './inventoryitem-detail.component.html'
})
export class InventoryItemDetailComponent implements OnInit {
    
    item: InventoryItem;
    id: string;
    inventories: any[];
    statuses: any[];
    inventory_id: any;
    backto: string[]=['/admin/inventoryitems'];
    InventoryItemActions: any[];
    @ViewChild("dialogRef") dialogRef: TemplateRef<any>;

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router,
        private dialog: MatDialog
    ) { }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.inventory_id = this.route.snapshot.queryParams["inventory_id"];
        if(this.inventory_id) this.backto = ['/admin/inventory',this.inventory_id];
        this.getLookups().subscribe(res=>{
            if (this.id === 'add') {
                this.item = new InventoryItem();
                this.item.InventoryID = this.inventory_id;
                this.item.StatusID = 2;
            }
            else {
                this.ApiClient.pGet("inventory_items/" + this.id, {}).pipe(take(1))
                    .subscribe(res => this.item = res);
            }
        });
    }

    getLookups(): Observable<any> {
        return forkJoin([
            this.ApiClient.pGet("inventory", {include:['InventoryType'], pageSize:this.util.MaxPageSize()}).pipe(take(1)),
            this.ApiClient.pGet("status_types", {}).pipe(take(1))])
        .pipe(map((res: any) => {
            this.inventories = res[0].rows;
            this.statuses = res[1];
        }));
    }
    
    add(): void {
        this.ApiClient.pPost("inventory_items", {}, this.item).pipe(take(1))
            .subscribe({
                next: res => {
                    this.item = res;
                    this.id = this.item.ID.toString();
                    this.router.navigate(this.backto);
                    this.util.alert("success", "Success Adding Inventory Item", false, { icon: 'check' }, true);
                },
                error: err => {
                    this.util.handleError(err, "Error Adding");
                }
            });
    }

    save(): void {
        this.ApiClient.pPut("inventory_items/" + this.id, {}, this.item).pipe(take(1))
            .subscribe({
                next: res => {
                    this.router.navigate(this.backto);
                    this.util.alert("success", "Success Saving Inventory Item", false, { icon: 'check' }, true);
                },
                error: err => {
                    this.util.handleError(err, "Error Saving");
                }
            });
    }

    getItemActions(): void {
        this.ApiClient.pGet("inventory_items/" + this.id, {include:[{'InventoryItemActions':['Action']}]}).pipe(take(1))
            .subscribe(res =>{
                let orderedItems = res.InventoryItemActions.sort((first:any, second:any) => first.createdAt > second.createdAt);
                const dialogRef = this.dialog.open(this.dialogRef, {
                        width:'600px',data:{actionitems:orderedItems},disableClose:false
                });
                dialogRef.afterClosed().subscribe(res=>{});
            } );
    }
    getChange(event: any) {
        event.stopPropagation();
    }
}