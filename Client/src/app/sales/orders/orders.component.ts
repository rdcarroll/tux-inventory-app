import { Component, OnInit } from '@angular/core';
import { Order } from '../sales';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Column, Config, MyColumn } from '../../../common/shared';

@Component({
    selector: 'my-orders',
    templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
    items: Order[];
    config: Config;
    searchText: string;
    message:string="Orders"
    columns : MyColumn[] = [
        {
            display: 'Order ID', //The text to display
            variable: 'ID', //The name of the key that's apart of the data array
            filter: 'text', //The type data type of the column (number, text, date, etc.)
            sortable:true,
            filterable:true
        },
        {
            display: 'Customer Name',
            variable: 'Customer.FullName',
            filter: 'text',
            sortable:true,
            filterable:true,
            autosize:true
        },
        {
            display: 'Use Date',
            variable: 'useDate',
            filter: 'date',
            sortable:true,
            filterable:true
        },
        {
            display: 'Created Date',
            variable: 'createdAt',
            filter: 'date',
            sortable:true,
            filterable:true
        },
        {
            filter: 'button',
            type: 'edit'
        },
        {
            filter: 'button',
            type: 'delete'
        }
    ];

    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.config = {
            page: 1,
            collectionSize: 0,
            maxSize: 5,
            pageSize: this.util.MaxPageSize()
        };
    }

    pageChange(): void {

        let q: APIParms = {
            pageSize: this.config.pageSize, page: (this.config.page), orderby:'useDate|desc',
            include:['Customer']
        }

        if (this.searchText && this.searchText.length > 0) q.qf = [this.searchText,'ID','Customer.LastName','Customer.Phone', 'Customer.Email'];

        this.util.loading(true, null);
        this.ApiClient.pGet("orders", q).pipe(finalize(() => this.util.loading(false, null)), take(1))
            .subscribe({
                next: (res) => {
                    // this.items = res;
                    // this.config.collectionSize = res.TotalCount;
                    this.items = res.rows;
                    this.config.collectionSize = res.count;
                },
                error: (err) => {
                    this.util.alert("error", err.statusText, false, null);
                }
            });
    }
    searchChanged(s: string) {
        this.searchText = s;
        this.config.page = 1;
        this.pageChange();
    }
    gridPageChange(page: number): void {
        this.config.page = page;
        this.pageChange();
    }
    remove(id: number): void {
        this.ApiClient.pRemove("orders/" + id, {}).pipe(take(1))
            .subscribe({next:(res) => {
                this.util.alert("success", "Order was successfully removed.", false, { icon: 'check' }, true);
                this.pageChange();
            }, error: (err) => {
                this.util.handleError(err, "Error Removing");
            }});
    }


    rowClick(row:any): void{
        this.router.navigate(['/sales/orders', row.ID]);
    }
    getBtn(args: any): void {
        switch (args[1]) {
            case "edit":
                this.router.navigate(['/sales/orders', args[0].ID]);
                break;
            case "delete":
                if (confirm("Are you sure?")) {
                    this.remove(args[0].ID)
                }
                break;
        }
    }

    ngOnInit(): void {
        this.searchText = this.route.snapshot.queryParamMap.get('keyword') || '';
        this.pageChange();
    }
}
