import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { mirage } from 'ldrs';

mirage.register();

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
