import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, map, finalize } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { Inventory, InventoryType } from '../admin';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'inventory-detail',
    templateUrl: './inventory-detail.component.html'
})
export class InventoryDetailComponent implements OnInit {
    
    item: Inventory;
    id: string;
    inventorytypes: InventoryType[];

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.getLookups().subscribe(res=>{
            if (this.id === 'add') {
                this.item = new Inventory();
            }
            else {
                let q = {include:[{'InventoryItems':['Status']}]};
                this.ApiClient.pGet("inventory/" + this.id, q).pipe(take(1))
                    .subscribe(res => this.item = res);
            }
        });
    }

    getLookups(): Observable<any> {
        return forkJoin([this.ApiClient.pGet("inventory_types", {pageSize:this.util.MaxPageSize()}).pipe(take(1))])
        .pipe(map((res: any) => {
            this.inventorytypes = res[0];
        }));
    }

    add(): void {
        this.ApiClient.pPost("inventory", {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.item = res;
                this.router.navigate(['/admin/inventory', this.item.ID]);
                this.util.alert("success", "Success Adding Inventory", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }
    save(): void {
        this.ApiClient.pPut("inventory/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/admin', 'inventory']);
                this.util.alert("success", "Success Saving Inventory", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}