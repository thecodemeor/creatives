import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

// Service
import packageJson from '../../../package.json'
import { animate, svg, stagger } from 'animejs';

// Accessory
import { LCD } from 'src/assets/shared/lcd'

interface MetadataFolder {
    id: string;
    name: string;
    folder: string;
    fileType: string;
    children: MetadataFolder[] | MetadataImage[];
}
interface MetadataImage {
    id: string;
    name: string;
    folder: string;
    fileType: string;
    width: number;
    height: number;
    tools: string[];
    colors: string[];
}

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
    ngAfterViewInit(): void {
        animate('.info', {
            translateY: { from: '-0.3rem'},
            opacity: { from: 0 }
        });
    }
    

    // *** Functions ************************************************** //
    signal: any
    toDisplay: string = ''
    getItem( file: any ) {
        this.signal = file
        this.toDisplay = 'assets/images/' + file.folder + '/' + file.id + '.' + file.fileType
    }

    sizeDisplay() {
        let width
        let height
        if ( this.responsive === 'mobile' || this.responsive === 'mobile-landscape' ) {
            width = this.signal.width / 4
            height = this.signal.height / 4
        } else {
            width = this.signal.width / 2
            height = this.signal.height / 2
        }
        return `width: ${ width }px; height: ${ height }px;`
    }

    closeSearchbar() {
        this.searchInput = ''
        this.search = false
    }

    clearSignal() {
        this.signal = []
        this.toDisplay = ''
    }

    flipped() {
        animate('.info', {
            opacity: { to: 0 },
            duration: 800
        });
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
