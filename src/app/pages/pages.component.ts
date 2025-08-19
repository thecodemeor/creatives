import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// JSON Data Base
import allFolder from 'src/assets/json/metadata.json';

@Component({
    selector: 'app-pages',
    standalone: false,
    templateUrl: './pages.component.html',
    styleUrl: './pages.component.scss'
})
export class Pages implements OnInit {
    @Output() sendItem = new EventEmitter< string >();

    breadcrumbs: string = ''
    constructor () {}

    folders: any[] = []
    files: any[] = []
    history: any[] = []
    ngOnInit() {
        this.openFolder( allFolder, true );
    }
    
    // *** Functions ************************************ //
    close() {
        if ( this.history.length > 1 ) {
            this.history.pop();

            const prev = this.history[ this.history.length - 1 ];
            this.openFolder( prev, false );
        } else { return }
    }

    openFolder( folder: any, add: boolean ) {
        if ( add ) { this.history.push( folder );}

        this.folders = []
        this.files = []
        for ( const item of folder.children ) {
            if ( item.fileType === 'folder') {
                this.folders.push( item )
            } else if ( item.fileType === 'png' || item.fileType === 'svg') {
                this.files.push( item )
            }
        }
        switch ( add ) {
            case true:
                this.breadcrumbs +=`/${ folder.name }`
                break;
            case false:
                this.breadcrumbs = this.breadcrumbs.substring( 0, this.breadcrumbs.lastIndexOf( "/" ))
                break;
        }
    }

    openFile( file: string ) {
        this.sendItem.emit( file );
    }
}
