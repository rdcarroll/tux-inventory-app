import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OrderItem } from '../sales';
//import { identifierModuleUrl } from '@angular/compiler';

@Component({
    selector: 'my-sizes',
    templateUrl: './sizes.component.html'
})
export class sizesComponent implements OnInit {
    @Input() customerid : number;
    @Output() itemChange = new EventEmitter<object>();
    @Output() closeEdit = new EventEmitter<boolean>();
    dialogRef: any;
    customer: any;
    customer_sizes: any[];
    customer_size: any;


    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {
    }


    getCustomer(customerID:number): Observable<any> {
        let q = {include:['CustomerSizes']}
        return this.ApiClient.pGet(`customers/${customerID}`, q).pipe(take(1),map((res: any) => {
            this.customer = res;
            //default
            if(this.customer.CustomerSizes.length){
                this.customer_size = this.customer.CustomerSizes[0];
            }
            else{
                this.customer_size = {CustomerID:this.customer.ID};
            }
        }));
    }
    
    size(template: TemplateRef<any>) {
        this.getCustomer(this.customerid).subscribe(res=>{
            
            this.dialogRef = this.dialog.open(template, {
              width: '60%'
            });
            this.dialogRef.afterClosed().subscribe((result: any) => {
                this.closeEdit.emit(true);
              });
        });
      }
      add() {
        this.ApiClient.pPost(`customer_sizes`, {}, this.customer_size).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Success Adding Customer Sizes", false, { icon: 'check' }, true);
                this.getCustomer(this.customerid).subscribe(res=>{
                });
            }, (err) => {
                this.util.handleError(err, "Error Adding Customer Sizes");
            });
        }
        save() {
            this.ApiClient.pPut(`customer_sizes/${this.customer_size.ID}`, {}, this.customer_size).pipe(take(1))
                .subscribe(res => {
                    this.util.alert("success", "Success Saving Customer Sizes", false, { icon: 'check' }, true);
                    this.getCustomer(this.customerid).subscribe(res=>{
                    });
                }, (err) => {
                    this.util.handleError(err, "Error Saving Customer Sizes");
                });
          }



    ngOnChanges(): void {
        
    }

    ngOnInit(): void {

    }
}
