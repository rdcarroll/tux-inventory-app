import { NgModule } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailComponent } from './employees/employee-detail.component';
import { customersComponent } from '../sales/customers/customers.component';
import { CustomerDetailComponent } from '../sales/customers/customer-detail.component';
import { eventtypesComponent } from './eventtypes/eventtypes.component';
import { EventTypeDetailComponent } from './eventtypes/eventtype-detail.component';
import { inventoryComponent } from './inventory/inventory.component';
import { inventoryitemsComponent } from './inventoryitems/inventoryitems.component';
import { InventoryItemDetailComponent } from './inventoryitems/inventoryitem-detail.component';
import { inventorytypesComponent } from './inventorytypes/inventorytypes.component';
import { InventoryTypeDetailComponent } from './inventorytypes/inventorytype-detail.component';
import { packagesComponent } from './packages/packages.component';
import { PackageDetailComponent } from './packages/package-detail.component';
import { InventoryDetailComponent } from './inventory/inventory-detail.component';
import { packageinventoryDetailComponent } from './packages/packageinventory-detail.component';
import { CompanyDetailComponent } from './company/company-detail.component';
import { BusinessInandoutPopupComponent } from './inventoryitems/inandout/inandout.component';
import { BusinessInandoutComponent } from './businandout/businandout.component';

//import { AppConnector, Application, Building, Company, Database, Department, Domain, Group, Server, Site } from './sitedata';

@NgModule({
    imports: [
        SharedModule,
        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
        EmployeesComponent,
        EmployeeDetailComponent,
        // customersComponent,
        // CustomerDetailComponent,
        eventtypesComponent,
        EventTypeDetailComponent,
        inventoryComponent,
        InventoryDetailComponent,
        inventoryitemsComponent,
        InventoryItemDetailComponent,
        inventorytypesComponent,
        InventoryTypeDetailComponent,
        packagesComponent,
        PackageDetailComponent,
        packageinventoryDetailComponent,
        CompanyDetailComponent,
        BusinessInandoutPopupComponent,
         BusinessInandoutComponent
    ]
})
export class AdminModule { }