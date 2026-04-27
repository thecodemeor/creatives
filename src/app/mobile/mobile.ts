import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { LogoComponent } from 'src/assets/shared/logo/logo.component';
import { ToolbarComponent } from 'src/assets/shared/toolbar';
import { Loading } from 'src/assets/components/loading';

import allFolder from 'src/assets/json/metadata.json';

@Component({
    selector: 'app-mobile',
    standalone: true,
    imports: [
        CommonModule,
        LogoComponent,
        ToolbarComponent,
        Loading
    ],
    templateUrl: './mobile.html',
    styleUrl: './mobile.scss',
})
export class Mobile implements OnInit, OnDestroy {
    folders: any[] = [];
    files: any[] = [];
    history: any[] = [];
    breadcrumbs: string = '';

    searchInput: string = '';
    allSearch: any[] = [];

    isDialogOpen = false;
    selectedFile: any = null;

    loadedImages = 0;

    isImageLoading = false;
    displayProgress = 0;

    private imageSub?: Subscription;
    private objectUrl?: string;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.openFolder(allFolder, true);
    }

    ngOnDestroy(): void {
        this.cleanupDialogImage();
    }

    openFolder(folder: any, add: boolean): void {
        if (add) {
            this.history.push(folder);
        }

        this.folders = [];
        this.files = [];
        this.loadedImages = 0;

        for (const item of folder.children) {
            if (
                item.fileType === 'folder' &&
                item.name?.toLowerCase() !== 'booklet'
            ) {
                this.folders.push(item);
            } else if (
                item.fileType === 'png' ||
                item.fileType === 'svg' ||
                item.fileType === 'jpg' ||
                item.fileType === 'jpeg' ||
                item.fileType === 'webp'
            ) {
                this.files.push(item);
            }
        }

        if (add) {
            this.breadcrumbs += `/${folder.name}`;
        } else {
            this.breadcrumbs = this.breadcrumbs.substring(
                0,
                this.breadcrumbs.lastIndexOf('/')
            );
        }
    }

    openFile(file: any): void {
        this.cleanupDialogImage();

        this.selectedFile = { ...file, preview: '' };
        this.isDialogOpen = true;
        this.isImageLoading = true;
        this.displayProgress = 0;

        document.body.style.overflow = 'hidden';

        const url = this.getFileImage(file);

        this.imageSub = this.http.get(url, {
            responseType: 'blob',
            observe: 'events',
            reportProgress: true
        }).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.DownloadProgress) {
                    if (event.total) {
                        this.displayProgress = Math.round(
                            (event.loaded / event.total) * 100
                        );
                    } else {
                        this.displayProgress = Math.min(this.displayProgress + 8, 95);
                    }
                }

                if (event.type === HttpEventType.Response) {
                    const blob = event.body;
                    if (!blob) {
                        this.onDialogImageError();
                        return;
                    }

                    this.objectUrl = URL.createObjectURL(blob);
                    this.selectedFile = {
                        ...file,
                        preview: this.objectUrl
                    };
                    this.displayProgress = 100;
                }
            },
            error: () => {
                this.onDialogImageError();
            }
        });
    }

    closeDialog(): void {
        this.isDialogOpen = false;
        this.isImageLoading = false;
        this.displayProgress = 0;
        document.body.style.overflow = '';

        this.cleanupDialogImage();

        setTimeout(() => {
            this.selectedFile = null;
        }, 250);
    }

    getFileImage(file: any): string {
        return `assets/images/${file.folder}/${file.id}.${file.fileType}`;
    }

    onAssetLoad(): void {
        if (this.loadedImages < this.files.length) {
            this.loadedImages++;
        }
    }

    get loadingPercent(): number {
        if (!this.files.length) {
            return 0;
        }

        return Math.round((this.loadedImages / this.files.length) * 100);
    }

    onDialogImageLoad(): void {
        this.isImageLoading = false;
        this.displayProgress = 100;
    }

    onDialogImageError(): void {
        this.isImageLoading = false;
        this.displayProgress = 0;
    }

    back(): void {
        if (this.history.length <= 1) {
            return;
        }

        this.history.pop();
        const prev = this.history[this.history.length - 1];
        this.openFolder(prev, false);
    }

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        if (this.isDialogOpen) {
            this.closeDialog();
        }
    }

    private cleanupDialogImage(): void {
        if (this.imageSub) {
            this.imageSub.unsubscribe();
            this.imageSub = undefined;
        }

        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = undefined;
        }
    }
}