import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// JSON Data Base
import imagesLogo from 'src/assets/json/imagesLogo.json';


@Component({
    selector: 'app-logo',
    standalone: false,
    templateUrl: './logo.component.html',
    styleUrl: '../pages.scss'
})
export class Logo implements OnInit{
    breadcrumbs: string = 'Work / Logo'
    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {}

    @Output() sendItem = new EventEmitter< string >();
    ngOnInit() {
        for ( const file of imagesLogo ) {
            if ( file.folder === this.breadcrumbs.toLowerCase().replace(/\s+/g, '' )) {
                this.files.push( file )
            }
        }
    }

    // *** Folder ************************************** //
    folders: any[] = []

    files: any[] = []
    
    // *** Functions ************************************ //
    close() {
        this.location.back()
    }

    openFolder( label: string ) {
        this.router.navigate( [])
    }

    openFile( file: string ) {
        this.sendItem.emit( file );
    }
}
