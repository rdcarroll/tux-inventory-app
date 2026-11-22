import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MyColumn } from '../../../common/shared';

@Component({
    selector: 'status',
    templateUrl: './status.component.html'
})
export class statusComponent implements OnInit {
    
    items: any[];
    statuses: any;
    status: any;
    message:string="Inventory Status Report"

    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) { }
    getInvOut(id:number): void{
        this.ApiClient.pGet("inventory_items", {pageSize:100000, filter:`StatusID|${id},InventoryID|!0,Barcode|!null`,include:['Status',{'Inventory':['InventoryType']}]}).pipe(take(1))
            .subscribe(res =>{
                this.items = res.rows;
            } );
    }

    getLookups(): Observable<any> {
        return forkJoin([
            this.ApiClient.pGet("status_types", {}).pipe(take(1))])
        .pipe(map((res: any) => {
            this.statuses = res[0];
            this.status = this.statuses[0].ID;
        }));
    }

    rowClick(id:any): void{
        
    }

    ngOnInit(): void {
        this.getLookups()
            .subscribe(res =>{
                this.getInvOut(this.status);
            } );
    }

    changeStatus(statusid:any): void {
        this.getInvOut(statusid);
    }

    columns:MyColumn[] = [
        {
            display:"Name",
            variable:"Inventory.InventoryType.Name",
            filter:'text',
            sortable:true,
            filterable:true
        },
        {
            display:"Description",
            variable:"Inventory.Description",
            filter:'text',
            sortable:true,
            filterable:true,
            autosize:true
        },
        {
            display:"Size",
            variable:"Size",
            filter:'text',
            sortable:true,
            filterable:true
        },
        {
            display:"Barcode",
            variable:"Barcode",
            filter:'text',
            sortable:true,
            filterable:true
        }
    ]
}