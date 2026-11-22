import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
//import { AppModuleNgFactory } from './app/app.module.ngfactory';


enableProdMode();

platformBrowser().bootstrapModule(AppModule);
//platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)

