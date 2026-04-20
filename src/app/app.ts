import {
    Component,
    signal,
    computed,
    inject
} from '@angular/core';

import { Desktop } from 'src/app/desktop/desktop';
import { Mobile } from 'src/app/mobile/mobile';

import { ResponsiveService } from 'src/assets/services/responsive.service';

@Component({
    selector: 'app-root',
    imports: [Desktop, Mobile],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('creatives');

    public responsive = inject(ResponsiveService);
    screen = computed(() => this.responsive.breakpoint());
}
