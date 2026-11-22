
import { Component, Output, EventEmitter, Input, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'my-search',
    templateUrl: './search.component.html'
})
export class SearchComponent {
    @Input() size: string;
    @Input() search: string;
    @Input() placeholder: string;
    @Input() iskeyword: boolean = true;
    @Output() searchChanged = new EventEmitter<string>();
    subscription: any;
    searchText: string;
    private search$ = new Subject<string>();

    constructor(
        private router: Router,
        private route: ActivatedRoute) {
    }

    emitter(val: any): void {
        if (this.iskeyword) this.router.navigate([], { relativeTo: this.route, queryParams: { keyword: val }, queryParamsHandling: 'merge' });
        this.searchChanged.emit(val);
    }
    changeSearch(): void {
        this.search$.next(this.searchText)
        //this.searchChanged.emit(this.searchText);
    }

    ngOnInit() {
        this.searchText = this.search || "";
        this.placeholder = this.placeholder || "Filter List";
        this.subscription = this.search$.pipe(
            debounceTime(800),
            distinctUntilChanged()).subscribe(response => {
                this.emitter(response);
            });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}


