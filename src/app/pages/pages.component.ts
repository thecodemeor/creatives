import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

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
    
    private breakpointObserver = inject( BreakpointObserver );
    constructor () {}
    
    folders: any[] = []
    files: any[] = []
    history: any[] = []
    breadcrumbs: string = ''
    responsive: string = ''
    loading: boolean = true
    ngOnInit() {
        this.loading = true
        this.breakpointObserver.observe([
            Breakpoints.HandsetPortrait,
            Breakpoints.HandsetLandscape,
            Breakpoints.TabletPortrait
        ])
        .subscribe( result => {
            if ( result.breakpoints[ Breakpoints.HandsetPortrait ]) {
                this.responsive = 'mobile'
            } else if ( result.breakpoints[ Breakpoints.HandsetLandscape ]) {
                this.responsive = 'mobile-landscape'
            } else if ( result.breakpoints[ Breakpoints.TabletPortrait ]) {
                this.responsive = 'tablet'
            } else {
                this.responsive = ''
            }
        });
        this.openFolder( allFolder, true );
        setTimeout(() => {
            this.loading = false
        }, 400);
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
        this.loading = true
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
        setTimeout(() => {
            this.loading = false
        }, 800);
    }

    openFile( file: string ) {
        this.sendItem.emit( file );
    }
}
