import { Component, OnInit } from '@angular/core';
import { EventType } from '../admin';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Column, Config, MyColumn } from '../../../common/shared';

@Component({
    selector: 'my-eventtypes',
    templateUrl: './eventtypes.component.html'
})
export class eventtypesComponent implements OnInit {
    items: EventType[];
    config: Config;
    searchText: string;
    message:string="Event Types"
    // Define the columns for the grid
    columns : MyColumn[] = [
        {
            display: 'Name', //The text to display
            variable: 'Name', //The name of the key that's apart of the data array
            filter: 'text', //The type data type of the column (number, text, date, etc.)
            sortable: true,
            filterable:true,
            autosize:true
        },
        {
            display: 'Created Date',
            variable: 'createdAt',
            filter: 'date',
            sortable: true,
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
            pageSize: this.config.pageSize, page: (this.config.page)
        }

        if (this.searchText && this.searchText.length > 0) q.qf = [this.searchText,'Name'];

        this.util.loading(true, null);
        this.ApiClient.pGet("event_types", q).pipe(finalize(() => this.util.loading(false, null)), take(1))
            .subscribe(
                (res) => {
                    this.items = res;
                    this.config.collectionSize = res.TotalCount;
                }, (err) => {
                    this.util.alert("error", err.statusText, false, null);
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
        this.ApiClient.pRemove("event_types/" + id, {}).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "EventType was successfully removed.", false, { icon: 'check' }, true);
                this.pageChange();
            }, (err) => {
                this.util.handleError(err, "Error Removing");
            });
    }


    rowClick(row: any): void {
        this.router.navigate(['/admin/eventtypes', row.ID]);
    }
    getBtn(args: any): void {
        switch (args[1]) {
            case "edit":
                this.router.navigate(['/admin/eventtypes', args[0].ID]);
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
