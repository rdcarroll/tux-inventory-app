import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService, Util } from '../../../core';
import * as root from '../../../../environments/environment';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    returnUrl: string;
    isWindows: boolean;
    credentials = { uid: root.UID, pwd: root.PWD };
    title = `${root.appname}`

    constructor(private security: SecurityService, private util: Util, private route: ActivatedRoute) {
        this.isWindows = root.loginmodel.toString() == "windows";
    }
    login() {
        console.log(this.returnUrl);
        //where do i need to return to after authenticating? it should be returnUrl parameter, if it is passed in.
        this.security.authN(this.credentials, this.returnUrl);
    }
    // forgotClicked() {
    //     this.security.requestPasswordReset(this.credentials.uid)
    //     .subscribe(res => {
    //         this.util.alert("success", "Thank You. A reset link has been emailed to the address on file for your User ID (UID).", true, { icon: 'check' }, true);
    //     }, (err) => {
    //         this.util.handleError(err, "Error Reseting");
    //     });
    // }

    ngOnInit() {
        this.returnUrl = decodeURI(this.route.snapshot.queryParamMap.get('returnUrl') || "");
        if (this.isWindows) this.login();
    }
}
