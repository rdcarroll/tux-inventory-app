import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ApiClientService, Util, APIParms } from '../../../../common/core';
import { finalize, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
//import { identifierModuleUrl } from '@angular/compiler';

@Component({
    selector: 'business-inandout',
    templateUrl: './inandout.component.html'
})
export class BusinessInandoutPopupComponent {
    @Output() itemChange = new EventEmitter<object>();
    @Output() closeEdit = new EventEmitter<boolean>();
    dialogRef: any;
    status_types: any[];
    status_type: any;
    barcode: any;
    invitem: any;
    inventory_items: any[];


    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
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
        return this.ApiClient.pGet(`inventory_items/${id}`, {include:['Inventory']}).pipe(take(1),map((res: any) => {
            this.inventory_items.push(res);
        }));
    }
    
    pickup(template: TemplateRef<any>) {
        this.inventory_items = [];
        this.getStatusTypes().subscribe(res => {
            this.dialogRef = this.dialog.open(template, {
              width: '80%'
            });
            this.dialogRef.afterClosed().subscribe((result: any) => {
                this.closeEdit.emit(true);
              });
        }, (err) => {
            this.util.handleError(err, "Error Saving");
        });
      }
    save(): void {
        this.getInventoryItem()
            .subscribe(
                (res) => {
                    if(this.invitem){
                        this.ApiClient.pPost(`inventory_items/${this.invitem.ID}/actions`, {}, {status_type:this.status_type}).pipe(take(1))
                            .subscribe(res => {
                                this.util.alert("success", "Success Saving Action", false, { icon: 'check' }, false);
                                this.addInventoryItem(this.invitem.ID).subscribe((result: any) => {
                                  });
                            }, (err) => {
                                this.util.handleError(err, "Error Saving");
                            });
                    }
                    else{
                        this.util.alert("warning", "Barcode Not Found", false, { icon: 'check' }, false);
                    }
                }, (err) => {
                    this.util.alert("error", err.statusText, false, null);
                });

    }
}
