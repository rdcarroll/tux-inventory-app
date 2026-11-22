import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { Package } from '../admin';
import { Router } from '@angular/router';

@Component({
    selector: 'package-detail',
    templateUrl: './package-detail.component.html'
})
export class PackageDetailComponent implements OnInit {
    
    item: Package;
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
            this.item = new Package();
        }
        else {
            let q = {include:[{'PackageInventory':[{'Inventory':['InventoryType']}]}]};
            this.ApiClient.pGet("packages/" + this.id, q).pipe(take(1))
                .subscribe(res => this.item = res);
        }
    }

    add(): void {
        this.ApiClient.pPost("packages", {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.item = res;
                this.id = this.item.ID.toString();
                this.router.navigate(['/admin', 'packages', this.item.ID]);
                this.util.alert("success", "Success Adding Package", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }

    save(): void {
        this.ApiClient.pPut("packages/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/admin', 'packages']);
                this.util.alert("success", "Success Saving Package", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}