import { Component, AfterViewInit, Input, Output, EventEmitter, inject } from '@angular/core';

// Service
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { animate, svg, stagger } from 'animejs';

// JSON Data Base
import allFolder from 'src/assets/json/metadata.json';


@Component({
    selector: 'app-views',
    standalone: false,
    templateUrl: './views.component.html',
    styleUrl: './views.component.scss'
})
export class Views implements AfterViewInit {
    @Input() set data( value: string ) {
        Promise.resolve().then(() => {
            if ( value ) { this.filterPackage( value) ;}
        });
    }
    @Output() sendItem = new EventEmitter< string >();

    allPackage: any = allFolder.children
    ngAfterViewInit() {
        this.allImage = this.getPackage( this.allPackage, "folder" )
    }


    allImage: any = []
    getPackage( packageJson: any, filter: string ): any[] {
        const result: any = [];
        for ( const node of packageJson ) {
            if ( node.fileType !== filter ) {
                result.push( node );
            }
            if ( node.children && node.children.length > 0 ) {
                result.push( ...this.getPackage( node.children, "folder" ));
            }
        }
        return result;
    }


    allSearch: any = []
    filterPackage( searchInput: string ) {
        this.allSearch = []
        for ( const file of this.allImage ) {
            const name = file.name.toLowerCase().trim()
            if ( name.includes( searchInput.toLowerCase().trim() )) {
                this.allSearch.push( file )
            }
        }
    }

    openFile( file: string ) {
        this.sendItem.emit( file );
    }
}
