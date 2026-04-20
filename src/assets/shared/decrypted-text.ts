import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

type RevealDirection = 'start' | 'end' | 'center';
type AnimateOn = 'view' | 'hover' | 'inViewHover' | 'click';
type ClickMode = 'once' | 'toggle';
type Direction = 'forward' | 'reverse';

@Component({
    selector: 'app-decrypted-text',
    standalone: true,
    template: `
        <span
            #containerRef
            class="decrypted-wrapper {{ parentClassName }}"
            (mouseenter)="onMouseEnter()"
            (mouseleave)="onMouseLeave()"
            (click)="onClick()"
        >
            <span class="sr-only">{{ displayText }}</span>
            <span aria-hidden="true">
                @for (item of renderedChars; track $index) {
                    <span [class]="item.revealed ? className : encryptedClassName">{{ item.char }}</span>
                }
            </span>
        </span>
    `,
    styles: `
        .decrypted-wrapper {
            display: inline-block;
            white-space: pre-wrap;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
        }
    `,
})
export class DecryptedTextComponent implements AfterViewInit, OnDestroy, OnChanges {
    @ViewChild('containerRef', { static: true })
    containerRef!: ElementRef<HTMLSpanElement>;

    @Input() text = '';
    @Input() speed = 50;
    @Input() maxIterations = 10;
    @Input() sequential = false;
    @Input() revealDirection: RevealDirection = 'start';
    @Input() useOriginalCharsOnly = false;
    @Input()
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

    @Input() className = '';
    @Input() parentClassName = '';
    @Input() encryptedClassName = '';

    @Input() animateOn: AnimateOn = 'hover';
    @Input() clickMode: ClickMode = 'once';

    displayText = '';
    isAnimating = false;
    isDecrypted = true;

    private revealedIndices = new Set<number>();
    private hasAnimated = false;
    private direction: Direction = 'forward';

    private intervalId: ReturnType<typeof setInterval> | null = null;
    private observer?: IntersectionObserver;
    private currentIteration = 0;
    private order: number[] = [];
    private pointer = 0;

    ngAfterViewInit(): void {
        this.initializeState();
        this.setupObserverIfNeeded();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['text'] ||
            changes['animateOn'] ||
            changes['characters'] ||
            changes['useOriginalCharsOnly']
        ) {
            this.initializeState();
        }

        if (changes['animateOn'] && this.containerRef) {
            this.teardownObserver();
            this.setupObserverIfNeeded();
        }
    }

    ngOnDestroy(): void {
        this.clearAnimation();
        this.teardownObserver();
    }

    get charactersArray(): string[] {
        if (this.useOriginalCharsOnly) {
            return Array.from(new Set(this.text.split(''))).filter(
                (char) => char !== ' '
            );
        }

        return this.characters.split('');
    }

    get renderedChars(): Array<{
        char: string;
        revealed: boolean;
    }> {
        return this.displayText.split('').map((char, index) => ({
        char,
        revealed:
            this.revealedIndices.has(index) || (!this.isAnimating && this.isDecrypted),
        }));
    }

    onMouseEnter(): void {
        if (
            this.animateOn === 'hover' ||
            this.animateOn === 'inViewHover'
        ) {
            this.triggerHoverDecrypt();
        }
    }

    onMouseLeave(): void {
        if (
            this.animateOn === 'hover' ||
            this.animateOn === 'inViewHover'
        ) {
            this.resetToPlainText();
        }
    }

    onClick(): void {
        if (this.animateOn !== 'click') {
            return;
        }

        if (this.clickMode === 'once') {
            if (this.isDecrypted) {
                return;
            }

            this.direction = 'forward';
            this.triggerDecrypt();
            return;
        }

        if (this.clickMode === 'toggle') {
            if (this.isDecrypted) {
                this.triggerReverse();
            } else {
                this.direction = 'forward';
                this.triggerDecrypt();
            }
        }
    }

    private initializeState(): void {
        this.clearAnimation();
        this.revealedIndices = new Set<number>();
        this.direction = 'forward';
        this.hasAnimated = false;

        if (this.animateOn === 'click') {
            this.encryptInstantly();
        } else {
            this.displayText = this.text;
            this.isDecrypted = true;
        }
    }

    private setupObserverIfNeeded(): void {
        if (
            !this.containerRef ||
            (this.animateOn !== 'view' && this.animateOn !== 'inViewHover')
        ) {
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.triggerDecrypt();
                        this.hasAnimated = true;
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        this.observer.observe(this.containerRef.nativeElement);
    }

    private teardownObserver(): void {
        this.observer?.disconnect();
        this.observer = undefined;
    }

    private encryptInstantly(): void {
        const emptySet = new Set<number>();
        this.revealedIndices = emptySet;
        this.displayText = this.shuffleText(this.text, emptySet);
        this.isDecrypted = false;
        this.isAnimating = false;
    }

    private triggerDecrypt(): void {
        this.clearAnimation();

        if (this.sequential) {
            this.order = this.computeOrder(this.text.length);
            this.pointer = 0;
            this.revealedIndices = new Set<number>();
        } else {
            this.revealedIndices = new Set<number>();
        }

        this.direction = 'forward';
        this.isAnimating = true;
        this.currentIteration = 0;

        this.startAnimationLoop();
    }

    private triggerReverse(): void {
        this.clearAnimation();

        if (this.sequential) {
            this.order = this.computeOrder(this.text.length).slice().reverse();
            this.pointer = 0;
            this.revealedIndices = this.fillAllIndices();
            this.displayText = this.shuffleText(this.text, this.revealedIndices);
        } else {
            this.revealedIndices = this.fillAllIndices();
            this.displayText = this.shuffleText(this.text, this.revealedIndices);
        }

        this.direction = 'reverse';
        this.isAnimating = true;
        this.currentIteration = 0;

        this.startAnimationLoop();
    }

    private triggerHoverDecrypt(): void {
        if (this.isAnimating) {
            return;
        }

        this.revealedIndices = new Set<number>();
        this.isDecrypted = false;
        this.displayText = this.text;
        this.direction = 'forward';
        this.isAnimating = true;
        this.currentIteration = 0;

        this.startAnimationLoop();
    }

    private resetToPlainText(): void {
        this.clearAnimation();
        this.revealedIndices = new Set<number>();
        this.displayText = this.text;
        this.isDecrypted = true;
        this.direction = 'forward';
    }

    private startAnimationLoop(): void {
        this.intervalId = setInterval(() => {
            if (this.sequential) {
                this.runSequentialFrame();
            } else {
                this.runNonSequentialFrame();
            }
        }, this.speed);
    }

    private runSequentialFrame(): void {
        if (this.direction === 'forward') {
            if (this.revealedIndices.size < this.text.length) {
                const nextIndex = this.getNextIndex(this.revealedIndices);
                const newRevealed = new Set(this.revealedIndices);
                newRevealed.add(nextIndex);
                this.revealedIndices = newRevealed;
                this.displayText = this.shuffleText(this.text, newRevealed);
            } else {
                this.clearAnimation();
                this.isDecrypted = true;
            }

            return;
        }

        if (this.pointer < this.order.length) {
            const idxToRemove = this.order[this.pointer++];
            const newRevealed = new Set(this.revealedIndices);
            newRevealed.delete(idxToRemove);
            this.revealedIndices = newRevealed;
            this.displayText = this.shuffleText(this.text, newRevealed);

            if (newRevealed.size === 0) {
                this.clearAnimation();
                this.isDecrypted = false;
            }
        } else {
            this.clearAnimation();
            this.isDecrypted = false;
        }
    }

    private runNonSequentialFrame(): void {
        if (this.direction === 'forward') {
            this.displayText = this.shuffleText(this.text, this.revealedIndices);
            this.currentIteration++;

            if (this.currentIteration >= this.maxIterations) {
                this.clearAnimation();
                this.displayText = this.text;
                this.isDecrypted = true;
            }

            return;
        }

        let currentSet = this.revealedIndices;
        if (currentSet.size === 0) {
            currentSet = this.fillAllIndices();
        }

        const removeCount = Math.max(
            1,
            Math.ceil(this.text.length / Math.max(1, this.maxIterations))
        );

        const nextSet = this.removeRandomIndices(currentSet, removeCount);
        this.revealedIndices = nextSet;
        this.displayText = this.shuffleText(this.text, nextSet);
        this.currentIteration++;

        if (nextSet.size === 0 || this.currentIteration >= this.maxIterations) {
            this.clearAnimation();
            this.isDecrypted = false;
            this.displayText = this.shuffleText(this.text, new Set<number>());
            this.revealedIndices = new Set<number>();
        }
    }

    private clearAnimation(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isAnimating = false;
    }

    private shuffleText(
        originalText: string,
        currentRevealed: Set<number>
    ): string {
        return originalText
        .split('')
        .map((char, i) => {
            if (char === ' ') {
                return ' ';
            }

            if (currentRevealed.has(i)) {
                return originalText[i];
            }

            const chars = this.charactersArray;
            return chars[Math.floor(Math.random() * chars.length)] ?? char;
        })
        .join('');
    }

    private computeOrder(len: number): number[] {
        const order: number[] = [];

        if (len <= 0) {
            return order;
        }

        if (this.revealDirection === 'start') {
            for (let i = 0; i < len; i++) {
                order.push(i);
            }
            return order;
        }

        if (this.revealDirection === 'end') {
            for (let i = len - 1; i >= 0; i--) {
                order.push(i);
            }
            return order;
        }

        const middle = Math.floor(len / 2);
        let offset = 0;

        while (order.length < len) {
            if (offset % 2 === 0) {
                const idx = middle + offset / 2;
                if (idx >= 0 && idx < len) {
                    order.push(idx);
                }
            } else {
                const idx = middle - Math.ceil(offset / 2);
                if (idx >= 0 && idx < len) {
                    order.push(idx);
                }
            }
            offset++;
        }

        return order.slice(0, len);
    }

    private fillAllIndices(): Set<number> {
        const set = new Set<number>();
        for (let i = 0; i < this.text.length; i++) {
            set.add(i);
        }
        return set;
    }

    private removeRandomIndices(
        source: Set<number>,
        count: number
    ): Set<number> {
        const arr = Array.from(source);

        for (let i = 0; i < count && arr.length > 0; i++) {
            const idx = Math.floor(Math.random() * arr.length);
            arr.splice(idx, 1);
        }

        return new Set(arr);
    }

    private getNextIndex(revealedSet: Set<number>): number {
        const textLength = this.text.length;

        switch (this.revealDirection) {
            case 'start':
                return revealedSet.size;

            case 'end':
                return textLength - 1 - revealedSet.size;

            case 'center': {
                const middle = Math.floor(textLength / 2);
                const offset = Math.floor(revealedSet.size / 2);
                const nextIndex =
                revealedSet.size % 2 === 0
                    ? middle + offset
                    : middle - offset - 1;

                if (
                    nextIndex >= 0 &&
                    nextIndex < textLength &&
                    !revealedSet.has(nextIndex)
                ) {
                    return nextIndex;
                }

                for (let i = 0; i < textLength; i++) {
                    if (!revealedSet.has(i)) {
                        return i;
                    }
                }

                return 0;
            }

            default:
                return revealedSet.size;
        }
    }
}