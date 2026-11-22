import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { PackageInventory } from '../admin';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'packageinventory-detail',
    templateUrl: './packageinventory-detail.component.html'
})
export class packageinventoryDetailComponent implements OnInit {
    
    item: PackageInventory;
    id: string;
    inventories: any[];
    packages: any[];
    package_id: any;
    backto: string[]=['/admin/packageinventory'];

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.package_id = this.route.snapshot.queryParams["package_id"];
        if(this.package_id) this.backto = ['/admin/packages',this.package_id];
        this.getLookups().subscribe(res=>{
            if (this.id === 'add') {
                this.item = new PackageInventory();
                this.item.PackageID = this.package_id;
            }
            else {
                this.ApiClient.pGet("package_inventory/" + this.id, {}).pipe(take(1))
                    .subscribe(res => this.item = res);
            }
        });
    }

    getLookups(): Observable<any> {
        return forkJoin([
            this.ApiClient.pGet("inventory", {include:['InventoryType']}).pipe(take(1)),
            this.ApiClient.pGet("packages", {}).pipe(take(1))])
        .pipe(map((res: any) => {
            this.inventories = res[0];
            this.packages = res[1];
        }));
    }
    
    add(): void {
        this.ApiClient.pPost("package_inventory", {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.item = res;
                this.id = this.item.ID.toString();
                this.router.navigate(this.backto);
                this.util.alert("success", "Success Adding Package Item", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }

    save(): void {
        this.ApiClient.pPut("package_inventory/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(this.backto);
                this.util.alert("success", "Success Saving Package Item", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}