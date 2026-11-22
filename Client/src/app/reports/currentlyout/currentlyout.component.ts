import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'currentlyout',
    templateUrl: './currentlyout.component.html'
})
export class currentlyoutComponent implements OnInit {
    
    items: any[];
    statuses: any;
    status: any;
    message:string="Inventory Currently Out with Customer Report"

    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) { }
    getInvOut(id:number): void{
        this.ApiClient.pGet("inventory_items", {filter:`StatusID|${id},Barcode|!null`,include:['Status',{'Inventory':['InventoryType']}]}).pipe(take(1))
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

    ngOnInit(): void {
        this.getInvOut(this.status);
    }

    changeStatus(statusid:any): void {
        this.getInvOut(statusid);
    }

}