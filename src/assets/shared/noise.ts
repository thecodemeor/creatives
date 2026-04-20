import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-noise',
    standalone: true,
    template: `<canvas #grainRef class="noise-overlay"></canvas>`,
    styles: `
        :host {
            position: absolute;
            inset: 0;
            display: block;
            pointer-events: none;
            z-index: 1;
        }

        .noise-overlay {
            width: 100%;
            height: 100%;
            display: block;
            image-rendering: pixelated;
            pointer-events: none;
            opacity: 1;
        }
    `,
})
export class NoiseComponent implements AfterViewInit, OnDestroy {
    @ViewChild('grainRef', { static: true })
    grainRef!: ElementRef<HTMLCanvasElement>;

    @Input() patternSize = 250;
    @Input() patternScaleX = 1;
    @Input() patternScaleY = 1;
    @Input() patternRefreshInterval = 2;
    @Input() patternAlpha = 15;

    private animationId = 0;
    private frame = 0;
    private readonly canvasSize = 1024;

    ngAfterViewInit(): void {
        const canvas = this.grainRef.nativeElement;
        const ctx = canvas.getContext('2d', { alpha: true });

        if (!ctx) { return;}

        const resize = (): void => {
            canvas.width = this.canvasSize;
            canvas.height = this.canvasSize;

            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.transform = `scale(${this.patternScaleX}, ${this.patternScaleY})`;
        };

        const drawGrain = (): void => {
            const imageData = ctx.createImageData(this.canvasSize, this.canvasSize);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = this.patternAlpha;
            }

            ctx.putImageData(imageData, 0, 0);
        };

        const loop = (): void => {
            if (this.frame % this.patternRefreshInterval === 0) {
                drawGrain();
            }

            this.frame++;
            this.animationId = window.requestAnimationFrame(loop);
        };

        this.handleResize = resize;
        window.addEventListener('resize', this.handleResize);

        resize();
        loop();
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.handleResize);
        window.cancelAnimationFrame(this.animationId);
    }

    private handleResize = (): void => {};
}