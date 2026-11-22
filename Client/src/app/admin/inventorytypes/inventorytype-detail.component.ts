import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { InventoryType } from '../admin';
import { Router } from '@angular/router';

@Component({
    selector: 'inventorytype-detail',
    templateUrl: './inventorytype-detail.component.html'
})
export class InventoryTypeDetailComponent implements OnInit {
    
    item: InventoryType;
    id: string;

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        if (this.id === 'add') {
            this.item = new InventoryType();
        }
        else {
            this.ApiClient.pGet("inventory_types/" + this.id, {}).pipe(take(1))
                .subscribe(res => this.item = res);
        }
    }

    add(): void {
        this.ApiClient.pPost("inventory_types", {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.item = res;
                this.id = this.item.ID.toString();
                this.router.navigate(['/admin', 'inventorytypes']);
                this.util.alert("success", "Success Adding Inventory Type", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }

    save(): void {
        this.ApiClient.pPut("inventory_types/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/admin', 'inventorytypes']);
                this.util.alert("success", "Success Saving Inventory Type", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}