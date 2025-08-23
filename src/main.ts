import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import 'ldrs/mirage';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
