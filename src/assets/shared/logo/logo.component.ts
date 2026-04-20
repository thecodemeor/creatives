import { Component } from '@angular/core';

// Service
import { animate } from 'animejs';

@Component({
    selector: 'app-logo',
    standalone: true,
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss'
})
export class LogoComponent {

    ngAfterViewInit() {
        animate( '.mini-o', {
            y: '3rem',
            ease: 'inOut',
            duration: 2000,
            loop: true,
            alternate: true
        });
    }
}