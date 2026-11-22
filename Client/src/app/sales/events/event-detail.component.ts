import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { Event } from '../sales';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'event-detail',
    templateUrl: './event-detail.component.html'
})
export class eventDetailComponent implements OnInit {
    
    item: Event;
    id: string;
    eventtypes: any;
    adding: boolean = false;

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router
    ) { }

    getLookups(): Observable<any> {
        return forkJoin([this.ApiClient.pGet("event_types", {pageSize:this.util.MaxPageSize()}).pipe(take(1))])
        .pipe(map((res: any) => {
            this.eventtypes = res[0];
        }));
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.getLookups().subscribe(res=>{
            if (this.id === 'add') {
                this.adding=true;
                this.item = new Event();
            }
            else {
                this.ApiClient.pGet("events/" + this.id, {include:[{'Orders':[{'OrderTickets':['Customer']}]}]}).pipe(take(1))
                    .subscribe(res => this.item = res);
            }
        });
    }

    add(): void {
        this.ApiClient.pPost("events", {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.adding=false;
                this.item = res;
                this.id = this.item.ID.toString();
                this.router.navigate(['/sales', 'events', this.item.ID]);
                this.util.alert("success", "Success Adding event", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }

    save(): void {
        this.ApiClient.pPut("events/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/sales', 'events']);
                this.util.alert("success", "Success Saving event", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

    eventDateChanged(evt:object): void {
        // let uDate = moment(evt);
        this.item.eventDate = evt as Date;
    }
}