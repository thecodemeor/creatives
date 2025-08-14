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

    @ViewChild( 'lcdRow', { static: true } ) lcdRow!: ElementRef< HTMLDivElement >;
    pixel: boolean = true
    ngOnInit() {
        this.animationLCD()
        setInterval(() => {
            const now = new Date();
            this.displayText = now.toLocaleTimeString( [], { hour: 'numeric', minute: '2-digit' });
            this.animationLCD();
        }, 60000);
    }

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

    // *** LCD ************************************************** //
    numChars = 8;
    charWidth = 5;
    charHeight = 8;
    pixelSize = 1;
    characterPatterns = LCD

    currentTime = new Date()
    displayText = this.currentTime.toLocaleTimeString( [], { hour: 'numeric', minute: '2-digit' });
    currentIndex = 0;
    scrollInterval: any;
    animationLCD() {
        for ( let i = 0; i < this.numChars; i++ ) {
            this.lcdRow.nativeElement.appendChild( this.createCharacterCell() );
        }
        this.startScrolling();
    }
    createCharacterCell(): HTMLDivElement {
        const charCell = document.createElement( 'div' );
        charCell.classList.add( 'lcd-char' );

        for ( let i = 0; i < this.charHeight * this.pixelSize; i++ ) {
            for ( let j = 0; j < this.charWidth * this.pixelSize; j++ ) {
                const pixel = document.createElement( 'div' );
                pixel.classList.add( 'pixel' );
                charCell.appendChild( pixel );
            }
        }
        return charCell;
    }
    startScrolling() {
        clearInterval( this.scrollInterval );
        if ( this.displayText.length > this.numChars ) {
            this.scrollInterval = setInterval( () => this.scrollText(), 300 );
        } else {
            this.updateDisplay( this.displayText );
        }
    }
    scrollText() {
        this.currentIndex++;
        if ( this.currentIndex > this.displayText.length - this.numChars ) {
            this.currentIndex = 0;
        }
        const visibleText = this.displayText.substring( this.currentIndex, this.currentIndex + this.numChars );
        this.updateDisplay( visibleText );
    }
    updateDisplay( text: string ) {
        const lcdEl = this.lcdRow.nativeElement;
        lcdEl.innerHTML = '';
        for ( let i = 0; i < this.numChars; i++ ) {
            const charCell = this.createCharacterCell();
            const char = text[i]?.toUpperCase() || ' ';
            const pattern = this.characterPatterns[ char ] || this.characterPatterns[' '];
            this.displayCharacter( charCell, pattern );
            lcdEl.appendChild( charCell );
        }
    }
    displayCharacter( charCell: HTMLElement, pattern: number[][] ) {
        const pixels = charCell.querySelectorAll( '.pixel' );
        let pixelIndex = 0;
        for ( let i = 0; i < this.charHeight; i++ ) {
            for ( let j = 0; j < this.charWidth; j++ ) {
                const on = pattern?.[ i ]?.[ j ] === 1;
                if ( pixels[pixelIndex] ) {
                    ( pixels[ pixelIndex ] as HTMLElement ).classList.toggle( 'on', on );
                    pixelIndex++;
                }
            }
        }
    }
}
