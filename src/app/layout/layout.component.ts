import { Component } from '@angular/core';

// Service
import packageJson from '../../../package.json'

@Component({
    selector: 'app-layout',
    standalone: false,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class Layout {
    version: string = packageJson.version
    licenseYear: number = new Date().getFullYear()

    currentpage: string = 'desktop'
    prevpage: string = 'desktop'
    closeFolder() {
        this.currentpage = 'desktop'
    }
    openFolder( label: string ) {
        this.prevpage = this.currentpage
        this.currentpage = label
    }

    toDisplay: string = ''
    openFile( file: any ) {
        this.toDisplay = file.imgfinder
    }

    // *** Folders ************************************************** //
    foldersDesktop: any[] = [
        { label: 'poster'},
        { label: 'logo'},
        { label: 'booklet'},
        { label: 'modelling'},
    ]

    foldersPoster: any[] = [
        { label: 'art 1', imgfinder: 'assets/images/works/poster/art1.png'},
        { label: 'art 2', imgfinder: 'assets/images/works/poster/art2.png'},
        { label: 'art 3', imgfinder: 'assets/images/works/poster/art3.png'},
        { label: 'art 4', imgfinder: 'assets/images/works/poster/art4.png'},
        { label: 'art 5', imgfinder: 'assets/images/works/poster/art5.png'},
        { label: 'art 6', imgfinder: 'assets/images/works/poster/art6.png'},
        { label: 'art 7', imgfinder: 'assets/images/works/poster/art7.png'},
        { label: 'art 8', imgfinder: 'assets/images/works/poster/art8.png'},
        { label: 'art 9', imgfinder: 'assets/images/works/poster/art9.png'},
        { label: 'art 10', imgfinder: 'assets/images/works/poster/art10.png'},
    ]

    foldersLogo: any[] = [
        { label: 'logo 1', imgfinder: 'assets/images/works/logo/logo1.png'},
        { label: 'logo 2', imgfinder: 'assets/images/works/logo/logo2.png'},
        { label: 'logo 3', imgfinder: 'assets/images/works/logo/logo3.png'},
        { label: 'logo 4', imgfinder: 'assets/images/works/logo/logo4.png'},
        { label: 'logo 5', imgfinder: 'assets/images/works/logo/logo5.png'},
        { label: 'logo 6', imgfinder: 'assets/images/works/logo/logo6.png'},
        { label: 'logo 7', imgfinder: 'assets/images/works/logo/logo7.png'},
        { label: 'logo 8', imgfinder: 'assets/images/works/logo/logo8.png'},
        { label: 'logo 9', imgfinder: 'assets/images/works/logo/logo9.png'},
        { label: 'logo 10', imgfinder: 'assets/images/works/logo/logo10.png'},
        { label: 'logo 11', imgfinder: 'assets/images/works/logo/logo5.png'},
        { label: 'logo 12', imgfinder: 'assets/images/works/logo/logo6.png'},
        { label: 'logo 13', imgfinder: 'assets/images/works/logo/logo7.png'},
        { label: 'logo 14', imgfinder: 'assets/images/works/logo/logo8.png'},
        { label: 'logo 15', imgfinder: 'assets/images/works/logo/logo9.png'},
        { label: 'logo 16', imgfinder: 'assets/images/works/logo/logo10.png'},
    ]

    foldersModelling: any[] = [
        { label: 'A01'},
        { label: 'A02'},
        { label: 'A03'},
        { label: 'A04'},
    ]

    foldersBooklet: any[] = [
        { label: 'A01'},
        { label: 'A02'},
        { label: 'A03'},
        { label: 'A04'},
    ]
}
