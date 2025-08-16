import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

// Service
import packageJson from '../../../package.json'

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

    pixel: boolean = true
    ngOnInit() {
        setInterval(() => {
            this.businessHour();
        }, 60000);
    }

    // *** Functions ************************************************** //
    toDisplay: string = ''
    getItem( file: any ) {
        this.toDisplay = 'assets/images/' + file.folder + '/' + file.id + '.' + file.fileType
        console.log(this.toDisplay, 'mcb')
    }

    onActivate( componentRef: any ) {
        if ( componentRef.sendItem ) {
            componentRef.sendItem.subscribe(( value: any ) => {
                this.getItem(value);
            });
        }
    }
    
    onDeactivate() {

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
