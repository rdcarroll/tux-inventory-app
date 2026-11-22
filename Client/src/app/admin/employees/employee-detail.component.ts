import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ApiClientService, CurrentUser, SecurityService, Util } from '../../../common/core';
import { Employee } from '../admin';
import { Router } from '@angular/router';

@Component({
    selector: 'employee-detail',
    templateUrl: './employee-detail.component.html'
})
export class EmployeeDetailComponent implements OnInit {
    
    item: Employee;
    id: string;
    pwd: string;
    canSetPWD: boolean;
    user: CurrentUser;

    constructor(
        private ApiClient: ApiClientService,
        private route: ActivatedRoute,
        private util: Util,
        private router: Router,
        private security: SecurityService
    ) {
        this.user = this.security.getUser();
        this.canSetPWD = this.security.hasAccess(this.security.Access.SuperAdmin);
     }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        if (this.id === 'add') {
            this.item = new Employee();
        }
        else {
            this.ApiClient.pGet("employees/" + this.id, {}).pipe(take(1))
                .subscribe(res => {
                    this.item = res;
                    this.canSetPWD = this.item.UserName == this.user.UserName ? true : this.canSetPWD;
                });
        }
    }

    add(): void {
        this.ApiClient.pPost("register", {mode:'auth'}, this.item).pipe(take(1))
            .subscribe(res => {
                this.router.navigate(['/admin', 'employees']);
                this.util.alert("success", "Success Adding Employee", false, { icon: 'check' }, true);
                // this.ApiClient.pPost("employees", {}, this.item).pipe(take(1))
                //     .subscribe(res => {
                //         this.item = res;
                //         this.router.navigate(['/admin', 'employees', this.item.ID]);
                //         this.util.alert("success", "Success Adding Employee", false, { icon: 'check' }, true);
                //     }, (err) => {
                //         this.util.handleError(err, "Error Adding");
                //     });
            }, (err) => {
                this.util.handleError(err, "Error assigning default password");
            });
    }

    save(): void {
        let pwd = this.item.Password;
        this.ApiClient.pPut("employees/" + this.id, {}, this.item).pipe(take(1))
            .subscribe(res => {
                if(this.pwd){
                    this.ApiClient.pPost("update", {mode:'auth'}, {UserName:this.item.UserName,Password:this.pwd}).pipe(take(1))
                        .subscribe(res => {
                            this.router.navigate(['/admin', 'employees']);
                            this.util.alert("success", "Success Saving Employee", false, { icon: 'check' }, true);
                        }, (err) => {
                            this.util.handleError(err, "Error assigning password");
                        });
                }
                else{
                    this.router.navigate(['/admin', 'employees']);
                    this.util.alert("success", "Success Saving Employee", false, { icon: 'check' }, true);
                }
            }, (err) => {
                this.util.handleError(err, "Error Saving");
            });
    }

}