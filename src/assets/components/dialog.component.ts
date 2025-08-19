import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dialog',
    standalone: false,
    template: `
    <div class="dialog" [style]="dialogStyle()">
        <ng-content></ng-content>
    </div>
    `,
    styles: `
        :host {
            position: absolute;
        }
    
    `
})
export class DialogComponent implements OnInit {
    @Input() top: string = ''
    @Input() left: string = '50%'
    @Input() width: string = ''
    @Input() height: string = ''

    ngOnInit() {
        
    }

    dialogStyle() {
        return `top: ${ this.top }; left: ${ this.left }; width: ${ this.width }; left: ${ this.height }`
    }
}