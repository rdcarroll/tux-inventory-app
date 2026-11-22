import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { ApiClientService } from './services/api-client.service';
import {FileService } from './services/file.service';
import { DownloadService } from './services/download.service';
import { Html2CSVService } from './services/html2csv.service';
import { Util } from './services/util.service';

import { SecurityService } from './security/security.service';
import { AuthGuard } from './security/auth-guard.service';
import { FileGuard } from './security/file-guard.service';
import { AdminGuard } from './security/admin-guard.service';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule
    ],
    declarations: [
    ],
    providers: [
        ApiClientService,
        FileService,
        DownloadService,
        Html2CSVService,
        Util,
        SecurityService,
        AuthGuard,
        FileGuard,
        AdminGuard
    ],
    exports: [
    ]
})
export class CoreModule { } 