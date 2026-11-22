import { Component, OnInit } from '@angular/core';
import { SecurityService, CurrentUser, Util, ApiClientService } from './../common/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, finalize, map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as root from '../environments/environment';
import * as $ from 'jquery';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = root.appname;
    user: CurrentUser;
    navs: any[];
    navName: string;
    canUse: boolean;
    canApprove: boolean;
    canAdmin: boolean;
    public isCollapsed:boolean = true;
    company: any;

    constructor(private security: SecurityService, private router: Router,
        private ApiClient: ApiClientService, private util: Util) {
        this.navName = "Menu";
    }

    logOut(): void {
        this.security.logout();
    }
    menuclicked($evt: boolean): void {
        if ($evt) {
            $("#mainmenu").css('position', 'inherit');
            $("body").css('padding-top', '0px');
            $("html,body").scrollTop(0);
        }
        else {
            $("#mainmenu").css('position', 'fixed');
            $("body").css('padding-top', '56px');
        }
    }
    setNav(): void {
        this.user = this.security.getUser();
        this.canAdmin = this.security.hasAccess(this.security.Access.Admin);
        this.canUse = this.security.hasAccess(this.security.Access.User);
       let company_id = '1';
        this.navs = [
            {
                link: null, display: "Sales", condition: this.canUse.toString(), icon: "far file-alt", childnavs: [
                    { link: "/sales/events", display: "Events", condition: this.canUse.toString(), icon: "far user", childnavs: [] },
                    { link: "/sales/orders", display: "Orders", condition: this.canUse.toString(), icon: "far file", childnavs: [] },
                    { link: "/sales/customers", display: "Customers", condition: this.canUse.toString(), icon: "far user", childnavs: [] }
                ]
            },
            {
                link: null, display: "Reports", condition: this.canUse.toString(), icon: "far file-alt", childnavs: [
                    //{ link: "/reports/itemhistory", display: "Item History", condition: this.canUse.toString(), icon: "far file", childnavs: [] },
                    //{ link: "/reports/currentlyout", display: "Inventory With Customer Report", condition: this.canUse.toString(), icon: "far file", childnavs: [] },
                    //{ link: "/reports/currentlypulled", display: "Inventory Pulled Report", condition: this.canUse.toString(), icon: "far file", childnavs: [] },
                    { link: "/reports/status", display: "Inventory Status Report", condition: this.canUse.toString(), icon: "far file", childnavs: [] },
                  
                ]
            },
            {
                link: null, display: "Admin", condition: this.canAdmin.toString(), icon: "fas wrench", childnavs: [
                    { link: "/admin/inandout", display: "In and Out (Laundry)", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    { link: "/admin/employees", display: "Employees", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    //{ link: "/admin/customers", display: "Customers", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    { link: "/admin/eventtypes", display: "EventTypes", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    { link: "/admin/inventorytypes", display: "InventoryTypes", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    { link: "/admin/inventory", display: "InventoryModels", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    { link: "/admin/inventoryitems", display: "InventoryItems", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    //{ link: "/admin/packages", display: "Packages", condition: this.canUse.toString(), icon: null, childnavs: [] },
                    { link: "/admin/companies/"+company_id, display: "Company", condition: this.canUse.toString(), icon: null, childnavs: [] },
          ]
            }
        ];
    }


    cacheData(): any {
        // return forkJoin(
        //     this.ApiClient.pGet("work_breakdown_structures/lookup2", { cache: true, wbsLength: 2 }).pipe(take(1))
        // ).pipe(finalize(() => this.util.loading(false, null)), map(res => {
        //     //let wbss = res[0];
        // }));
    }
    
    getCompany(): void {
        if(this.security.isAuthenticated()){
            this.ApiClient.pGet("Companies", {}).pipe(take(1))
                .subscribe(res => {
                    this.company = res[0];
                    this.title = `${this.company.Name} ${this.title}`;
                    this.util.setData('company',res[0]);
                }, (err) => {
                    //this.util.handleError(err, "Error getting company info");
                });
        }
    }
    ngOnInit() {
        this.setNav();
        this.getCompany();
        //if user message is updated, check it for authZ
        this.security.getUserMessage().subscribe(user => {
            if (!user) {
                this.canUse = false;
                this.router.navigate(['/nauthed']);
            }
            else {
                this.getCompany();
                this.security.authZ();
            }
        });
        //if authz message is updated, check it for authZ
        this.security.getAuthzMessage().subscribe(res => {
            if (res.success) {
                this.setNav();
                let nextRoute = this.util.isEmpty(this.security.getReturnUrl()) ? '/landing' : this.security.getReturnUrl();
                this.router.navigate([nextRoute]);
            } else {
                this.security.logout();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationStart))
            .subscribe((event:any) => {
                // You only receive NavigationStart events

                $("body").removeClass("print-page");
                $("html").removeClass("print-page");

                this.util.alertcancel(true);
            });

   //this.cacheData().subscribe((res: any) => { });
    }
}