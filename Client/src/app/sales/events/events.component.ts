import { Component, OnInit } from '@angular/core';
import { Event } from '../sales';
import { ApiClientService, Util, APIParms } from '../../../common/core';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Column, Config, MyColumn } from '../../../common/shared';

@Component({
    selector: 'my-events',
    templateUrl: './events.component.html'
})
export class eventsComponent implements OnInit {
    items: Event[];
    config: Config;
    searchText: string;
    message:string="Events"
    columns : MyColumn[] = [
        {
            display: 'Event Name', //The text to display
            variable: 'EventName', //The name of the key that's apart of the data array
            filter: 'text', //The type data type of the column (number, text, date, etc.)
            sortable:true,
            filterable:true,
            autosize:true
        },
        {
            display: 'Event Date',
            variable: 'eventDate',
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
            pageSize: this.config.pageSize, page: (this.config.page), orderby:"eventDate|desc"
        }

        if (this.searchText && this.searchText.length > 0) q.qf = [this.searchText,'EventName']; 

        this.util.loading(true, null);
        this.ApiClient.pGet("events", q).pipe(finalize(() => this.util.loading(false, null)), take(1))
            .subscribe(
                (res) => {
                    // this.items = res;
                    // this.config.collectionSize = res.TotalCount;
                    this.items = res.rows;
                    this.config.collectionSize = res.count;
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
    rowClick(row: any): void {
                this.router.navigate(['/sales/events', row.ID]);
    }
    remove(id: number): void {
        this.ApiClient.pRemove("events/" + id, {}).pipe(take(1))
            .subscribe(res => {
                this.util.alert("success", "Event was successfully removed.", false, { icon: 'check' }, true);
                this.pageChange();
            }, (err) => {
                this.util.handleError(err, "Error Removing");
            });
    }

    getBtn(args: any): void {
        switch (args[1]) {
            case "edit":
                this.router.navigate(['/sales/events', args[0].ID]);
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
