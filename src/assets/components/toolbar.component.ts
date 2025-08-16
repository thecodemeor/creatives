import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    standalone: false,
    template: `
        <div class="container-button">
            <ng-content></ng-content>
        </div>
        <div class="breadcrumbs">
            <span [innerHTML]="breadcrumbsLabel()"></span>
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
        }
        .container-button {
            height: 2rem;
            aspect-ratio: 1 / 1;
        }
        .breadcrumbs {
            flex: 1 1 0;
            display: flex;
            width: 100%;
            padding: 0 var( --spacing-2 );
            border-left: dotted 1px var( --line-grayscale );
            align-items: center;
        }
    `
})
export class ToolbarComponent implements OnInit {
    @Input() breadcrumbs: string = 'button'

    buttonClass: string = ''
    directionFlex: string = 'row'
    ngOnInit() {}

    breadcrumbsLabel() {
        return this.breadcrumbs.replace( /\s*\/\s*/, '&nbsp;<span class="pole">|</span>&nbsp;');
    }
}