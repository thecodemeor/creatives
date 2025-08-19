import { Component, OnInit, inject } from '@angular/core';

// Service
import packageJson from '../../../package.json'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

// Accessory
import { LCD } from 'src/assets/shared/lcd'

@Component({
    selector: 'app-layout',
    standalone: false,
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss', '../../assets/shared/bat.scss']
})
export class Layout implements OnInit {
    version: string = packageJson.version
    licenseYear: number = new Date().getFullYear()
    private breakpointObserver = inject( BreakpointObserver );

    responsive: string = ''
    pixel: boolean = true
    search: boolean = false
    searchInput: string = ''
    ngOnInit() {
        this.breakpointObserver.observe([
            Breakpoints.HandsetPortrait,
            Breakpoints.HandsetLandscape,
            Breakpoints.TabletPortrait
        ])
        .subscribe( result => {
            if ( result.matches && !result.breakpoints[ Breakpoints.HandsetLandscape ]) {
                this.responsive = 'mobile'
            } else if ( result.breakpoints[ Breakpoints.HandsetLandscape ]) {
                this.responsive = 'mobile-landscape'
            } else {
                this.responsive = ''
            }
        });
        setInterval(() => {
            this.businessHour();
        }, 60000);
    }

    // *** Functions ************************************************** //
    signal: any
    toDisplay: string = ''
    getItem( file: any ) {
        this.signal = file
        console.log( file.width, 'mcb')
        this.toDisplay = 'assets/images/' + file.folder + '/' + file.id + '.' + file.fileType
    }

    sizeDisplay() {
        const width = this.signal.width / 4
        const height = this.signal.height / 4
        return `width: ${ width }px; height: ${ height }px;`
    }

    closeSearchbar() {
        this.searchInput = ''
        this.search = false
    }

    // *** Business Hour ************************************************** //
    businessHour(): boolean {
        const now = new Date();
        const hours = now.getHours();
        return hours >= 9 && hours < 18;
    }

    // *** Contact ************************************************** //
    openExternal( link: string ) {
        switch ( link ) {
            case 'email':
                window.location.href = `mailto:meorhakimz@gmail.com`;
                break;
        }
    }
}
