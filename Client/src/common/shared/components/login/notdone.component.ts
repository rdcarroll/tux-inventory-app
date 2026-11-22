import { Component } from '@angular/core';

@Component({
    selector: 'my-not-implemented',
    template: `
                <app-jumbo customTitle="Not Implemented"></app-jumbo>

                <div class="container">
                    <div class="row">
                        <div class="col-md-3">
                        </div>
                        <div class="col-md-6">
                            <div class="alert alert-warning text-center">
                                <p>You have reached a function that is not yet implemented. Please click the browser back button to return to your previous step.</p>
                                <p>Sorry for the inconvenience! Please try again later.</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                        </div>
                    </div>
                </div>
                `
})

export class NotDoneComponent {
    constructor() { }
}
