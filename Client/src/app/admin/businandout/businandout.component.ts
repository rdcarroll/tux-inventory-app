import { Component, OnInit } from '@angular/core';
import { EventType } from '../admin';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Column, Config } from '../../../common/shared';
import { Observable } from 'rxjs';

@Component({
    selector: 'my-businandout',
    templateUrl: './businandout.component.html'
})
export class BusinessInandoutComponent implements OnInit {
    dialogRef: any;
    status_types: any[];
    status_type: any;
    barcode: any;
    invitem: any;
    inventory_items: any[] = [];

    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    getStatusTypes(): Observable<any> {
        return this.ApiClient.pGet(`status_types`, {}).pipe(take(1),map((res: any) => {
            this.status_types = res;
        }));
    }
    getInventoryItem(): Observable<any> {
        return this.ApiClient.pGet("inventory_items", {filter:`barcode|'${this.barcode}'`}).pipe(take(1),map((res: any) => {
            this.invitem = res.rows[0];
        }));
    }
    addInventoryItem(id:number): Observable<any> {
        return this.ApiClient.pGet(`inventory_items/${id}`, {include:[{'Inventory':['InventoryType']},"Status"]}).pipe(take(1),map((res: any) => {
            this.inventory_items.push(res);
        }));
    }
    
    save(): void {
        this.getInventoryItem()
            .subscribe({
                next: (res) => {
                    if(null != this.invitem && this.status_type != null){
                        this.ApiClient.pPost(`inventory_items/${this.invitem.ID}/actions`, {}, {status_type:this.status_type}).pipe(take(1))
                            .subscribe({
                                next: res => {
                                    this.util.alert("success", "Success Saving Action", false, { icon: 'check' }, false);
                                    this.addInventoryItem(this.invitem.ID).subscribe();
                                },
                                error: (err) => {
                                    this.util.handleError(err, "Error Saving");
                                }
                            });
                    }
                    else{
                        this.util.alert("warning", "Barcode Not Found", false, { icon: 'exclamation' }, false);
                    }
                },
                error: (err) => {
                    this.util.alert("error", err.statusText, false, null);
                }
            });

    }
    ngOnInit(): void {
        this.getStatusTypes().subscribe(res => {
            if(this.status_types.length > 0) this.status_type = this.status_types[0].ID;
        }, (err) => {
            this.util.handleError(err, "Server Error");
        });
    }
}
