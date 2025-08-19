import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    standalone: false,
    template: `
        <div class="container-button">
            <ng-content></ng-content>
        </div>
        <div class="breadcrumbs">
            <p [innerHTML]="breadcrumbsLabel()"></p>
            <span #dragEnd></span>
        </div>
    `,
    styles: `
        :host {
            --spacing-1: 0.615rem;
            --spacing-2: 1.25rem;
            --gapline: 1px;
            display: flex;
            width: 100%; height: fit-content;
            padding: var( --spacing-1 );
            border-bottom: dotted var( --gapline ) var( --default );
            gap: var( --spacing-1 );
            overflow-x: hidden;
        }
        .container-button {
            height: 2rem;
            aspect-ratio: 1 / 1;
        }
        .breadcrumbs {
            flex: 1 1 auto;
            display: flex;
            width: auto; min-width: 0;
            padding: 0 var( --spacing-2 );
            border-left: dotted 1px var( --line-grayscale );
            align-items: center;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
        }
        .breadcrumbs p {
            display: inline;
            margin: 0;
        }
    `
})
export class ToolbarComponent implements OnInit {
    @ViewChild('dragEnd') dragEndRef!: ElementRef;
    @Input() breadcrumbs: string = ''

    ngOnInit() {}

    breadcrumbsLabel() {
        let firstclean = this.breadcrumbs.startsWith('/') ? this.breadcrumbs.substring(1) : this.breadcrumbs
        let parts = firstclean.split('/').filter(Boolean)
        let capitalized = parts.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        let newbreadcrumbs = capitalized.join('/');

        this.scrollToRight()
        return newbreadcrumbs.replace( /\//g, '&nbsp;<span class="pole">|</span>&nbsp;')
    }

    scrollToRight(): void {
        try {
            if (this.dragEndRef && this.dragEndRef.nativeElement) {
                this.dragEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Error scrolling to bottom:', err);
        }
    }
}