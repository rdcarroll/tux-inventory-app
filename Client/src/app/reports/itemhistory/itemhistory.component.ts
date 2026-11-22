import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'itemhistory',
    templateUrl: './itemhistory.component.html'
})
export class itemhistoryComponent implements OnInit {
    
    item: any;
    id: string;

    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) { }


    ngOnInit(): void {
        // this.id = this.route.snapshot.paramMap.get('id');
        // this.ApiClient.pGet("companies/" + this.id, {}).pipe(take(1))
        //     .subscribe(res => this.item = res);
    }


}