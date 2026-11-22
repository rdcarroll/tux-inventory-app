import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from '../../common/core';

import { AdminComponent } from './admin.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailComponent } from './employees/employee-detail.component';
// import { customersComponent } from '../sales/customers/customers.component';
// import { CustomerDetailComponent } from '../sales/customers/customer-detail.component';
import { eventtypesComponent } from './eventtypes/eventtypes.component';
import { EventTypeDetailComponent } from './eventtypes/eventtype-detail.component';
import { inventoryComponent } from './inventory/inventory.component';
import { InventoryDetailComponent } from './inventory/inventory-detail.component';
import { inventorytypesComponent } from './inventorytypes/inventorytypes.component';
import { InventoryTypeDetailComponent } from './inventorytypes/inventorytype-detail.component';
import { inventoryitemsComponent } from './inventoryitems/inventoryitems.component';
import { InventoryItemDetailComponent } from './inventoryitems/inventoryitem-detail.component';
import { packagesComponent } from './packages/packages.component';
import { PackageDetailComponent } from './packages/package-detail.component';
import { packageinventoryDetailComponent } from './packages/packageinventory-detail.component';
import { CompanyDetailComponent } from './company/company-detail.component';
import { BusinessInandoutComponent } from './businandout/businandout.component';

const routes: Routes = [
    {
        path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard],
        children: [
            { path: 'employees', component: EmployeesComponent },
            { path: 'employees/:id', component: EmployeeDetailComponent },
            
            // { path: 'customers', component: customersComponent },
            // { path: 'customers/:id', component: CustomerDetailComponent },
            
            { path: 'eventtypes', component: eventtypesComponent },
            { path: 'eventtypes/:id', component: EventTypeDetailComponent },
            
            { path: 'inventory', component: inventoryComponent },
            { path: 'inventory/:id', component: InventoryDetailComponent },
            
            { path: 'inventorytypes', component: inventorytypesComponent },
            { path: 'inventorytypes/:id', component: InventoryTypeDetailComponent },
            
            { path: 'inventoryitems', component: inventoryitemsComponent },
            { path: 'inventoryitems/:id', component: InventoryItemDetailComponent },
            
            { path: 'packages', component: packagesComponent },
            { path: 'packages/:id', component: PackageDetailComponent },
            { path: 'packageinventory/:id', component: packageinventoryDetailComponent },

            { path: 'companies/:id', component: CompanyDetailComponent },

            { path: 'inandout', component: BusinessInandoutComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    //exports: [RouterModule]
})
export class AdminRoutingModule { }