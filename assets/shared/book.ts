import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-book',
    standalone: true,
    imports: [NgStyle],
    template: `
        <div class="container" [class]="responsive" [ngStyle]="cssVars">
            <div class="book">
                <div class="pages">
                    <div class="page"></div>
                    <div class="page"></div>
                    <div class="page"></div>
                    <div class="page"></div>
                    <div class="page"></div>
                    <div class="page"></div>
                </div>

                <div class="flips">
                    <div class="flip flip1">
                        <div class="flip flip2">
                            <div class="flip flip3">
                                <div class="flip flip4">
                                    <div class="flip flip5">
                                        <div class="flip flip6">
                                            <div class="flip flip7"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @if (pages.length) {
                <div class="grid">
                    @for (image of pages; track $index) {
                        <img [src]="image" alt="page preview" />
                    }
                </div>
            }
        </div>
    `,
    styles: `
        :host {
            display: block;
            height: 100%;
        }

        .container {
            position: relative;
            width: var(--w, 420px);
            height: calc(var(--w, 420px));
            border-radius: 4px;
            border: solid 2px transparent;
            margin: 0 auto;
            font-family: "Indie Flower", cursive;
            background-color: transparent;
            color: #555;
            text-align: center;
        }

        .container.mobile,
        .container.mobile-landscape {
            width: auto;
            scale: 0.7;
        }

        @keyframes preLoad {
            0%   { background-image: var(--img1); }
            10%  { background-image: var(--img2); }
            20%  { background-image: var(--img3); }
            30%  { background-image: var(--img4); }
            40%  { background-image: var(--img5); }
            100% { display: none; }
        }

        .book {
            position: relative;
            perspective: 630px;
            perspective-origin: center 50px;
            filter: drop-shadow(0px 10px 5px rgba(0, 0, 0, 0.25));
        }

        .pages,
        .flips { transform-style: preserve-3d;}

        .page {
            width: calc(var(--w, 420px) / 2);
            height: var(--h, 300px);
            background-color: #fff;
            position: absolute;
            top: 0;
            right: 50%;
            transform-origin: 100% 100%;
            border: solid #555 2px;
            background-size: var(--w, 420px) var(--h, 300px);
            background-position: center;
            transform-style: preserve-3d;
        }

        .page:nth-child(1) { transform: rotateX(60deg) rotateY(3deg); }
        .page:nth-child(2) { transform: rotateX(60deg) rotateY(4.5deg); }

        .page:nth-child(3) {
            transform: rotateX(60deg) rotateY(6deg);
            animation: nextPage var(--cycle, 25s) infinite -24s steps(1);
            background-size: var(--w, 420px) var(--h, 300px);
            background-position: -2px -2px;
        }

        .page:nth-child(4) { transform: rotateX(60deg) rotateY(177deg); }
        .page:nth-child(5) { transform: rotateX(60deg) rotateY(175.5deg); }

        .page:nth-child(6) {
            transform: rotateX(60deg) rotateY(174deg);
            overflow: hidden;
        }

        .page:nth-child(6)::after {
            background: #fff;
            content: "";
            width: calc(var(--w, 420px) / 2);
            height: var(--h, 300px);
            position: absolute;
            top: 0;
            right: 0;
            transform-origin: center;
            transform: rotateY(180deg);
            animation: nextPage var(--cycle, 25s) -20s infinite steps(1);
            background-size: var(--w, 420px) var(--h, 300px);
            background-position: 100% -2px;
        }

        @keyframes nextPage {
            0%  { background-image: var(--img1); }
            20% { background-image: var(--img2); }
            40% { background-image: var(--img3); }
            60% { background-image: var(--img4); }
            80% { background-image: var(--img5); }
        }

        .flip {
            width: 32px;
            height: var(--h, 300px);
            position: absolute;
            top: 0;
            transform-origin: 100% 100%;
            right: 100%;
            border: solid #555;
            border-width: 2px 0;
            perspective: 4200px;
            perspective-origin: center;
            transform-style: preserve-3d;
            background-size: var(--w, 420px) var(--h, 300px);
        }

        .flip::after {
        content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            transform-origin: center;
            background-size: var(--w, 420px) var(--h, 300px);
        }

        .flip.flip1 {
            right: 50%;
            animation: flip1 5s infinite ease-in-out;
            border-width: 2px 2px 2px 0;
        }

        .flip.flip1::after { animation: nextFlip1 var(--cycle, 25s) -20s infinite steps(1);}

        .flip:not(.flip1) {
            right: calc(100% - 2px);
            top: -2px;
            transform-origin: right;
            animation: flip2 5s ease-in-out infinite;
        }

        .flip.flip2::after { animation: nextFlip2 var(--cycle, 25s) -20s infinite steps(1); }
        .flip.flip3::after { animation: nextFlip3 var(--cycle, 25s) -20s infinite steps(1); }
        .flip.flip4::after { animation: nextFlip4 var(--cycle, 25s) -20s infinite steps(1); }
        .flip.flip5::after { animation: nextFlip5 var(--cycle, 25s) -20s infinite steps(1); }
        .flip.flip6::after { animation: nextFlip6 var(--cycle, 25s) -20s infinite steps(1); }

        .flip.flip7 {
            width: 30px;
            border-width: 2px 0 2px 2px;
        }

        .flip.flip7::after {
            animation: nextFlip7 var(--cycle, 25s) -20s infinite steps(1);
        }

        @keyframes flip1 {
            0%, 20%   { transform: rotateX(60deg) rotateY(6deg); }
            80%, 100% { transform: rotateX(60deg) rotateY(174deg); }
        }

        @keyframes flip2 {
            0%, 20% { transform: rotateY(0deg) translateY(0px); }
            50%     { transform: rotateY(-15deg) translateY(0px); }
        }

        @keyframes nextFlip1 {
            0%  { background-image: var(--img1); background-position: -178px -2px; transform: rotateY(0deg); }
            10% { background-image: var(--img2); background-position: -210px -2px; transform: rotateY(180deg); }
            20% { background-image: var(--img2); background-position: -178px -2px; transform: rotateY(0deg); }
            30% { background-image: var(--img3); background-position: -210px -2px; transform: rotateY(180deg); }
            40% { background-image: var(--img3); background-position: -178px -2px; transform: rotateY(0deg); }
            50% { background-image: var(--img4); background-position: -210px -2px; transform: rotateY(180deg); }
            60% { background-image: var(--img4); background-position: -178px -2px; transform: rotateY(0deg); }
            70% { background-image: var(--img5); background-position: -210px -2px; transform: rotateY(180deg); }
            80% { background-image: var(--img5); background-position: -178px -2px; transform: rotateY(0deg); }
            90% { background-image: var(--img1); background-position: -210px -2px; transform: rotateY(180deg); }
        }

        @keyframes nextFlip2 {
            0%   { background-image: var(--img1); background-position: -148px -2px; transform: rotateY(0deg); }
            10.5%{ background-image: var(--img2); background-position: -238px -2px; transform: rotateY(180deg); }
            20%  { background-image: var(--img2); background-position: -148px -2px; transform: rotateY(0deg); }
            30.5%{ background-image: var(--img3); background-position: -238px -2px; transform: rotateY(180deg); }
            40%  { background-image: var(--img3); background-position: -148px -2px; transform: rotateY(0deg); }
            50.5%{ background-image: var(--img4); background-position: -238px -2px; transform: rotateY(180deg); }
            60%  { background-image: var(--img4); background-position: -148px -2px; transform: rotateY(0deg); }
            70.5%{ background-image: var(--img5); background-position: -238px -2px; transform: rotateY(180deg); }
            80%  { background-image: var(--img5); background-position: -148px -2px; transform: rotateY(0deg); }
            90.5%{ background-image: var(--img1); background-position: -238px -2px; transform: rotateY(180deg); }
        }

        @keyframes nextFlip3 {
            0%  { background-image: var(--img1); background-position: -118px -2px; transform: rotateY(0deg); }
            11% { background-image: var(--img2); background-position: -268px -2px; transform: rotateY(180deg); }
            20% { background-image: var(--img2); background-position: -118px -2px; transform: rotateY(0deg); }
            31% { background-image: var(--img3); background-position: -268px -2px; transform: rotateY(180deg); }
            40% { background-image: var(--img3); background-position: -118px -2px; transform: rotateY(0deg); }
            51% { background-image: var(--img4); background-position: -268px -2px; transform: rotateY(180deg); }
            60% { background-image: var(--img4); background-position: -118px -2px; transform: rotateY(0deg); }
            71% { background-image: var(--img5); background-position: -268px -2px; transform: rotateY(180deg); }
            80% { background-image: var(--img5); background-position: -118px -2px; transform: rotateY(0deg); }
            91% { background-image: var(--img1); background-position: -268px -2px; transform: rotateY(180deg); }
        }

        @keyframes nextFlip4 {
            0%    { background-image: var(--img1); background-position: -88px -2px; transform: rotateY(0deg); }
            11.5% { background-image: var(--img2); background-position: -298px -2px; transform: rotateY(180deg); }
            20%   { background-image: var(--img2); background-position: -88px -2px; transform: rotateY(0deg); }
            31.5% { background-image: var(--img3); background-position: -298px -2px; transform: rotateY(180deg); }
            40%   { background-image: var(--img3); background-position: -88px -2px; transform: rotateY(0deg); }
            51.5% { background-image: var(--img4); background-position: -298px -2px; transform: rotateY(180deg); }
            60%   { background-image: var(--img4); background-position: -88px -2px; transform: rotateY(0deg); }
            71.5% { background-image: var(--img5); background-position: -298px -2px; transform: rotateY(180deg); }
            80%   { background-image: var(--img5); background-position: -88px -2px; transform: rotateY(0deg); }
            91.5% { background-image: var(--img1); background-position: -298px -2px; transform: rotateY(180deg); }
        }

        @keyframes nextFlip5 {
            0%  { background-image: var(--img1); background-position: -58px -2px; transform: rotateY(0deg); }
            12% { background-image: var(--img2); background-position: -328px -2px; transform: rotateY(180deg); }
            20% { background-image: var(--img2); background-position: -58px -2px; transform: rotateY(0deg); }
            32% { background-image: var(--img3); background-position: -328px -2px; transform: rotateY(180deg); }
            40% { background-image: var(--img3); background-position: -58px -2px; transform: rotateY(0deg); }
            52% { background-image: var(--img4); background-position: -328px -2px; transform: rotateY(180deg); }
            60% { background-image: var(--img4); background-position: -58px -2px; transform: rotateY(0deg); }
            72% { background-image: var(--img5); background-position: -328px -2px; transform: rotateY(180deg); }
            80% { background-image: var(--img5); background-position: -58px -2px; transform: rotateY(0deg); }
            92% { background-image: var(--img1); background-position: -328px -2px; transform: rotateY(180deg); }
        }

        @keyframes nextFlip6 {
            0%    { background-image: var(--img1); background-position: -28px -2px; transform: rotateY(0deg); }
            12.5% { background-image: var(--img2); background-position: -358px -2px; transform: rotateY(180deg); }
            20%   { background-image: var(--img2); background-position: -28px -2px; transform: rotateY(0deg); }
            32.5% { background-image: var(--img3); background-position: -358px -2px; transform: rotateY(180deg); }
            40%   { background-image: var(--img3); background-position: -28px -2px; transform: rotateY(0deg); }
            52.5% { background-image: var(--img4); background-position: -358px -2px; transform: rotateY(180deg); }
            60%   { background-image: var(--img4); background-position: -28px -2px; transform: rotateY(0deg); }
            72.5% { background-image: var(--img5); background-position: -358px -2px; transform: rotateY(180deg); }
            80%   { background-image: var(--img5); background-position: -28px -2px; transform: rotateY(0deg); }
            92.5% { background-image: var(--img1); background-position: -358px -2px; transform: rotateY(180deg); }
        }

        @keyframes nextFlip7 {
            0%  { background-image: var(--img1); background-position: -2px -2px; transform: rotateY(0deg); }
            13% { background-image: var(--img2); background-position: -388px -2px; transform: rotateY(180deg); }
            20% { background-image: var(--img2); background-position: -2px -2px; transform: rotateY(0deg); }
            33% { background-image: var(--img3); background-position: -388px -2px; transform: rotateY(180deg); }
            40% { background-image: var(--img3); background-position: -2px -2px; transform: rotateY(0deg); }
            53% { background-image: var(--img4); background-position: -388px -2px; transform: rotateY(180deg); }
            60% { background-image: var(--img4); background-position: -2px -2px; transform: rotateY(0deg); }
            73% { background-image: var(--img5); background-position: -388px -2px; transform: rotateY(180deg); }
            80% { background-image: var(--img5); background-position: -2px -2px; transform: rotateY(0deg); }
            93% { background-image: var(--img1); background-position: -388px -2px; transform: rotateY(180deg); }
        }

        .grid {
            display: grid;
            width: 100%;
            height: fit-content;
            margin-top: calc(var(--w, 420px) / 1.2);
            padding-bottom: 1.25rem;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            grid-auto-rows: auto;
            gap: 0.625rem;
        }

        .grid img {
            max-width: 100%;
            display: block;
            border: solid 1px black;
        }
    `,
})
export class BookComponent implements OnInit, OnChanges {
    @Input() images: string[] = [];
    @Input() pages: string[] = [];

    @Input() width = 420;
    @Input() height = 300;
    @Input() cycleSec = 25;
    @Input() scale = 1.2;

    cssVars: Record<string, string> = {};
    responsive = '';

    ngOnInit(): void {
        this.updateCssVars();
    }

    ngOnChanges(_: SimpleChanges): void {
        this.updateCssVars();
    }

    private updateCssVars(): void {
        const fallbackImages = [
            'https://picsum.photos/420/300?random=1',
            'https://picsum.photos/420/300?random=2',
            'https://picsum.photos/420/300?random=3',
            'https://picsum.photos/420/300?random=4',
            'https://picsum.photos/420/300?random=5',
        ];

        const base = this.images.length > 0 ? this.images : fallbackImages;
        const pick = (i: number) => base[((i % base.length) + base.length) % base.length];

        this.cssVars = {
            '--w': `${this.width}px`,
            '--h': `${this.height}px`,
            '--cycle': `${this.cycleSec}s`,
            '--scale': `${this.scale}`,
            '--img1': `url("${pick(0)}")`,
            '--img2': `url("${pick(1)}")`,
            '--img3': `url("${pick(2)}")`,
            '--img4': `url("${pick(3)}")`,
            '--img5': `url("${pick(4)}")`,
        };
    }
}