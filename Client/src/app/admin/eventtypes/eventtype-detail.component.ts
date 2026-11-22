import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { EventType } from '../admin';
import { Router } from '@angular/router';

@Component({
    selector: 'eventtype-detail',
    templateUrl: './eventtype-detail.component.html'
})
export class EventTypeDetailComponent implements OnInit {
    
    item: EventType;
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
            this.item = new EventType();
        }
        else {
            this.ApiClient.pGet("event_types/" + this.id, {}).pipe(take(1))
                .subscribe(res => this.item = res);
        }
    }

    add(): void {
        this.ApiClient.pPost("event_types", {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.item = res;
                this.id = this.item.ID.toString();
                this.router.navigate(['/admin', 'eventtypes']);
                this.util.alert("success", "Success Adding Event Type", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Adding");
            });
    }

    save(): void {
        this.ApiClient.pPut("event_types/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/admin', 'eventtypes']);
                this.util.alert("success", "Success Saving Event Type", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}