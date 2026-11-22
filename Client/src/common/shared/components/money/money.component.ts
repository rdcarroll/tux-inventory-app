
import { CurrencyPipe } from '@angular/common';
import { Component, Output, EventEmitter, Input, OnInit, OnChanges, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'my-money',
    templateUrl: './money.component.html'
})
export class MoneyComponent implements OnInit, OnChanges {
    @Input() money: number;
    @Input() placeholder: string;
    @Output() moneyChange = new EventEmitter<number>();
    subscription: any;
    moneyText: string;
    private money$ = new Subject<number>();

    constructor(
        private currencyPipe: CurrencyPipe,
        private router: Router,
        private route: ActivatedRoute) {
    }

    emitter(val: number): void {
        this.moneyChange.emit(val);
    }
    changeMoney(): void {
        var stringValue = this.moneyText.replace('$','');
        var numberValue = Number(stringValue);
        this.money$.next(numberValue)
        //this.searchChanged.emit(this.searchText);
    }
    
    formatMoney(value:number): string|null {
        return this.currencyPipe.transform(value);
    }

    ngOnInit() {
        this.moneyText = this.formatMoney(this.money) || "0.00";
        this.placeholder = this.placeholder || "$ or %";
        this.subscription = this.money$.pipe(
            //debounceTime(2600),
            distinctUntilChanged()).subscribe(response => {

                this.emitter(response);
                this.moneyText = this.formatMoney(response) || "0.00";
            });
    }
    ngOnChanges() {
        this.moneyText = this.formatMoney(this.money) || "0.00";
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}


