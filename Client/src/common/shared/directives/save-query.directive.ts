import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../core';

@Directive({
  selector: '[saveQuery]',
})
export class SaveQueryDirective implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute, private router: Router, private util: Util) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        //let rt = this.router.currentNavigation.previousNavigation.finalUrl;
        let rt = this.route.snapshot.queryParams;
        this.util.setData('backto', rt);
    }

}
