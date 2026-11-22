import { Component } from '@angular/core';

@Component({
    selector: 'my-admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent {
    links: any[];

    constructor(
    ) {
        this.links = [
            { link: "/admin/administrators", display: "Administrators", condition: "true", icon: null, childnavs: [] }
        ];
    }
}
