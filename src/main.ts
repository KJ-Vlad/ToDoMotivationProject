import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { defineCustomElements } from '@ionic/core/loader';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './environments/firebase';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Firebase init
initializeApp(firebaseConfig);

defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
