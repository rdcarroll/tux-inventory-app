import { Component, Output, EventEmitter, ContentChild, ElementRef, OnDestroy } from "@angular/core";
import { ViewModeDirective } from "./viewmode.directive";
import { EditModeDirective } from "./editmode.directive";
import { Subject ,  fromEvent } from "rxjs";
import { filter, take, switchMapTo, takeUntil } from "rxjs/operators";

@Component({
    selector: 'editable',
    template: `
    <ng-container *ngTemplateOutlet="currentView"></ng-container>
  `
})
export class EditableComponent implements OnDestroy {
    @Output() update = new EventEmitter();
    @ContentChild(ViewModeDirective, {static:false}) viewModeTpl: ViewModeDirective;
    @ContentChild(EditModeDirective, { static: false }) editModeTpl: EditModeDirective;
    private unsubscribe$ = new Subject<void>();

    editMode = new Subject();
    editMode$ = this.editMode.asObservable();

    mode: 'view' | 'edit' = 'view';

    constructor(private host: ElementRef) {
    }

    get currentView() {
        return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
    }

    private viewModeHandler() {
        fromEvent(this.element, 'dblclick').pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(() => {
            this.mode = 'edit';
            this.editMode.next(true);
        });
    }

    private editModeHandler() {
        const clickOutside$ = fromEvent(document, 'click').pipe(
            filter(({ target }) => this.element.contains(target) === false),
            take(1)
        )

        this.editMode$.pipe(
            switchMapTo(clickOutside$),
            takeUntil(this.unsubscribe$)
        ).subscribe(event => {
            this.update.next(null);
            this.mode = 'view';
        });
    }

    ngOnInit() {
        this.viewModeHandler();
        this.editModeHandler();
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private get element() {
        return this.host.nativeElement;
    }
  
}