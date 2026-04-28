import {
    Component,
    OnDestroy,
    OnInit,
    computed,
    effect,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { LogoComponent } from 'src/assets/shared/logo/logo.component';
import { NoiseComponent } from 'src/assets/shared/noise';
import { ToolbarComponent } from 'src/assets/shared/toolbar';
import { BookComponent } from 'src/assets/shared/book';
import { Loading } from 'src/assets/components/loading';

import packageJson from '../../../package.json';
import allFolder from 'src/assets/json/metadata.json';

@Component({
    selector: 'app-desktop',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NoiseComponent,
        ToolbarComponent,
        BookComponent,
        LogoComponent,
        Loading
    ],
    templateUrl: './desktop.html',
    styleUrl: './desktop.scss',
})
export class Desktop implements OnInit, OnDestroy {
    readonly version: string = packageJson.version;

    readonly openItems = signal(false);

    private readonly rootFolder = allFolder as any;
    private readonly allPackage: any[] = (this.rootFolder?.children ?? []) as any[];

    readonly history = signal<any[]>([]);
    readonly currentFolder = computed<any | null>(() => {
        const h = this.history();
        return h.length ? h[h.length - 1] : null;
    });

    readonly breadcrumbs = computed(() => {
        const h = this.history();
        if (!h.length) return '';
        return h.map((f) => `/${f.name}`).join('');
    });

    readonly folders = computed<any[]>(() => {
        const folder = this.currentFolder();
        const children: any[] = folder?.children ?? [];
        return children.filter((item) => item?.fileType === 'folder');
    });

    readonly files = computed<any[]>(() => {
        const folder = this.currentFolder();
        const children: any[] = folder?.children ?? [];
        return children.filter(
            (item) => item?.fileType === 'png' || item?.fileType === 'svg'
        );
    });

    readonly loadedImages = signal(0);

    readonly searchInput = signal('');
    readonly allImage = signal<any[]>([]);
    readonly allSearch = computed<any[]>(() => {
        const keyword = this.searchInput().toLowerCase().trim();
        if (!keyword) return [];
        return this.allImage().filter((file) =>
            (file?.name ?? '').toLowerCase().trim().includes(keyword)
        );
    });

    readonly toDisplay = signal('');
    readonly selectedFile = signal<any | null>(null);
    readonly booklet = signal<any[]>([]);
    readonly pages = signal<any[]>([]);

    readonly isLoading = signal(false);
    readonly displayProgress = signal(0);

    private displayRequestSub?: Subscription;
    private objectUrl?: string;

    constructor(private http: HttpClient) {
        effect(() => {
            // Reset grid loader whenever the set of visible files changes.
            // (Also triggers on folder navigation.)
            this.files();
            this.loadedImages.set(0);
        });
    }

    ngOnInit(): void {
        this.openFolder(this.rootFolder, true);
        this.allImage.set(this.getPackage(this.allPackage, 'folder'));
    }

    openFolder(folder: any, add: boolean): void {
        if (!folder) return;
        if (add) {
            this.history.update((h) => [...h, folder]);
        } else {
            // back() already popped; just replace the head so computed stays consistent
            this.history.update((h) => (h.length ? [...h.slice(0, -1), folder] : [folder]));
        }
    }

    openFile(file: any): void {
        this.cleanupDisplayRequest();

        this.openItems.set(true);
        this.toDisplay.set('');
        this.booklet.set([]);
        this.pages.set([]);
        this.selectedFile.set(file);
        this.isLoading.set(true);
        this.displayProgress.set(0);

        if (file.folder === 'work/booklet') {
            const name = file.name.replace(/\s+/g, '').toLowerCase();
            const pageMerge = file.pages / 2;

            const nextPages: string[] = [];
            for (let i = 0; i < file.pages; i++) {
                const id = i + 1;
                nextPages.push(`assets/images/work/booklet/${name}/${id}.svg`);
            }

            const nextBooklet: string[] = [];
            for (let i = 0; i < pageMerge; i++) {
                const id = i + 1;
                nextBooklet.push(
                    `assets/images/work/booklet/${name}/book/${id}.png`
                );
            }

            this.pages.set(nextPages);
            this.booklet.set(nextBooklet);
            this.isLoading.set(false);
            this.displayProgress.set(100);
            return;
        }

        const url = `assets/images/${file.folder}/${file.id}.${file.fileType}`;

        this.displayRequestSub = this.http.get(url, {
            responseType: 'blob',
            observe: 'events',
            reportProgress: true
        }).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.DownloadProgress) {
                    if (event.total) {
                        this.displayProgress.set(Math.round(
                            (event.loaded / event.total) * 100
                        ));
                    } else {
                        // total may be missing, so keep a soft progress state
                        this.displayProgress.set(
                            Math.min(this.displayProgress() + 8, 95)
                        );
                    }
                }

                if (event.type === HttpEventType.Response) {
                    const blob = event.body;
                    if (!blob) {
                        return;
                    }

                    this.cleanupObjectUrl();
                    this.objectUrl = URL.createObjectURL(blob);
                    this.toDisplay.set(this.objectUrl);

                    // keep loader visible until the actual <img> finishes painting
                    this.displayProgress.set(100);
                }
            }
        });
    }

    onAssetLoad(): void {
        if (this.loadedImages() < this.files().length) {
            this.loadedImages.update((v) => v + 1);
        }
    }

    filterPackage(searchInput: string): void {
        this.searchInput.set(searchInput);
    }

    getPackage(packageJson: any, filter: string): any[] {
        const result: any[] = [];

        for (const node of packageJson) {
            if (node.fileType !== filter) {
                result.push(node);
            }

            if (node.children && node.children.length > 0) {
                result.push(...this.getPackage(node.children, 'folder'));
            }
        }

        return result;
    }

    getFolderName(path: string) {
        return path.split('/')[1]
    }

    openLinkWebsite() {
        window.open('https://www.meorhakim.com', '_blank');
    }

    readonly lightboxOpen = signal(false);
    openLightbox(): void {
        this.lightboxOpen.set(true);
    }

    closeLightbox(): void {
        this.lightboxOpen.set(false);
    }

    close(): void {
        this.cleanupDisplayRequest();
        this.selectedFile.set(null);
        this.toDisplay.set('');
        this.booklet.set([]);
        this.pages.set([]);
        this.isLoading.set(false);
        this.displayProgress.set(0);
        this.openItems.set(false);
        this.lightboxOpen.set(false);
    }

    back(): void {
        if (this.history().length <= 1) {
            return;
        }

        this.history.update((h) => h.slice(0, -1));
    }

    ngOnDestroy(): void {
        this.cleanupDisplayRequest();
        this.cleanupObjectUrl();
    }

    private cleanupDisplayRequest(): void {
        this.displayRequestSub?.unsubscribe();
        this.displayRequestSub = undefined;
        this.isLoading.set(false);
    }

    private cleanupObjectUrl(): void {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = undefined;
        }
    }
}