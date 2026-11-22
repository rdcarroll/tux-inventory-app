import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
//import {
//    MatButtonModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule, MatExpansionModule,
//    MatDialogModule, MatTabsModule, MatDatepickerModule, MatInputModule, MatAutocompleteModule
//} from '@angular/material';

// material.module.ts
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select'

@NgModule({
    imports: [CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule,
        MatExpansionModule, MatDialogModule, MatTabsModule, MatDatepickerModule, MatInputModule, MatAutocompleteModule,MatSelectModule],
    exports: [CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule,
        MatExpansionModule, MatDialogModule, MatTabsModule, MatDatepickerModule, MatInputModule, MatAutocompleteModule,MatSelectModule],
})
export class CustomMaterialModule { }