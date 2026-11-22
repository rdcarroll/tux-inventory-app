import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiClientService, Util } from '../../../common/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'company-detail',
    templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent implements OnInit {
    
    item: any;
    id: string;

    constructor(
        private ApiClient: ApiClientService,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) { }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.ApiClient.pGet("companies/" + this.id, {}).pipe(take(1))
            .subscribe(res => this.item = res);
    }


    save(): void {
        this.ApiClient.pPut("companies/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/admin', 'companies', this.id]);
                this.util.alert("success", "Success Saving Company Info", false, { icon: 'check' }, true);
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}