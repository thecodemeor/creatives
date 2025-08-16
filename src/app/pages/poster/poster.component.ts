import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// JSON Data Base
import imagesPoster from 'src/assets/json/imagesPoster.json';

@Component({
    selector: 'app-poster',
    standalone: false,
    templateUrl: './poster.component.html',
    styleUrl: '../pages.scss'
})
export class Poster implements OnInit {
    breadcrumbs: string = 'Work / Poster'
    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {}

    @Output() sendItem = new EventEmitter< string >();
    ngOnInit() {
        for ( const file of imagesPoster ) {
            if ( file.folder === this.breadcrumbs.toLowerCase().replace(/\s+/g, '' )) {
                this.files.push( file )
            }
        }
    }

    // *** Folder ************************************** //
    folders: any[] = [
        { label: 'ads'},
        { label: 'business'},
        { label: 'car'},
        { label: 'education'},
        { label: 'event'}, // Exp: Raya, Merdeka
        { label: 'fashion'},
        { label: 'food'},
        { label: 'inspire'},
        { label: 'socmed'},
        { label: 'wedding'},
    ]

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
        console.log(file, 'mcb')
    }
}
