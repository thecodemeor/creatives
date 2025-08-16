import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-work',
    standalone: false,
    templateUrl: './work.component.html',
    styleUrls: ['./work.component.scss', '../pages.scss']
})
export class Work {
    breadcrumbs: string = 'Work'
    constructor (
        private route: ActivatedRoute,
        private router: Router
    ) {}

    // *** Folder ************************************** //
    folders: any[] = [
        { label: 'poster'},
        { label: 'logo'},
    ]
    // *** Functions ************************************ //
    openFolder( label: string ) {
        this.router.navigate( [label], { relativeTo: this.route.parent})
    }
}