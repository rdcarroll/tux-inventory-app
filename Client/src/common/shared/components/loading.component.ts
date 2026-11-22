import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Util } from '../../core';

@Component({
    selector: 'loading-spinner',
    template: "<div class='loading' *ngIf='show'><div class='center'>loading..............</div></div>"
    //template: "<div class='loading' *ngIf='show'><div class='center'><fa-icon [icon]=\"['fas', 'circle-notch']\" [spin]=\"true\" class=\"ettp-text-primary\" size=\"7x\"></fa-icon></div></div>"
})

export class LoadingComponent implements OnInit, OnDestroy {
    private subscription: Subscription;

    constructor(private loadingService: Util) { }

    show: boolean;

    ngOnInit() {
        this.show = false;
        this.subscription = this.loadingService.getLoadingMessage().subscribe(msg => {
            this.show = msg;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
