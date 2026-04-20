import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    standalone: true,
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
            --gapline: 1px;
            display: flex;
            width: 100%; height: fit-content;
            padding: 0.2rem;
            border-bottom: solid 1px color-mix(in srgb, #758262 50%, transparent);
            align-items: center;
            overflow-x: hidden;
        }
        .container-button {
            height: 0.8rem;
            aspect-ratio: 1 / 1;
            cursor: pointer;
        }
        .breadcrumbs {
            flex: 1 1 auto;
            display: flex;
            width: auto; min-width: 0;
            border-left: dotted 1px var( --line-grayscale );
            align-items: center;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
        }
        .breadcrumbs p {
            display: inline;
            margin: 0;
            font-size: 0.5rem;
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