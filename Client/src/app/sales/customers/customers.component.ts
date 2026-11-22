import { Component, OnInit } from '@angular/core';
import { Customer } from '../sales';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Column, Config, MyColumn } from '../../../common/shared';

@Component({
    selector: 'my-customers',
    templateUrl: './customers.component.html'
})
export class customersComponent implements OnInit {
    items: Customer[];
    config: Config;
    searchText: string;
    message:string="Customers"
    columns : MyColumn[] = [
        {
            display: 'Full Name', //The text to display
            variable: 'FullName', //The name of the key that's apart of the data array
            filter: 'text', //The type data type of the column (number, text, date, etc.)
            sortable:true,
            filterable:true,
            autosize:true
        },
        {
            display: 'Email',
            variable: 'Email',
            filter: 'text',
            sortable:true,
            filterable:true,
            autosize:true
        },
        {
            display: 'Phone',
            variable: 'Phone',
            filter: 'text',
            sortable:true,
            filterable:true,
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
            pageSize: this.config.pageSize, page: (this.config.page), orderby:"LastName|asc,FirstName|asc"
        }

        if (this.searchText && this.searchText.length > 0) q.qf = [this.searchText,'FirstName','LastName','Email','Phone'];

        this.util.loading(true, null);
        this.ApiClient.pGet("customers", q).pipe(finalize(() => this.util.loading(false, null)), take(1))
            .subscribe({
                next: (res) => {
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
        this.ApiClient.pRemove("customers/" + id, {}).pipe(take(1))
            .subscribe({
                next: (res) => {
                    this.util.alert("success", "Customer was successfully removed.", false, { icon: 'check' }, true);
                    this.pageChange();
                },
                error: (err) => {
                    this.util.handleError(err, "Error Removing");
                }
            });
    }


    rowClick(arg:any): void{
        let row: Customer = arg;
                this.router.navigate(['/sales/customers', row.ID]);
    }
    getBtn(args: any): void {
        switch (args[1]) {
            case "edit":
                this.router.navigate(['/sales/customers', args[0].ID]);
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
