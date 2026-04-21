import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecryptedTextComponent } from 'src/assets/shared/decrypted-text';
import { ToolbarComponent } from 'src/assets/shared/toolbar';
import { Loading } from 'src/assets/components/loading';

import allFolder from 'src/assets/json/metadata.json';

@Component({
    selector: 'app-mobile',
    standalone: true,
    imports: [
        CommonModule,
        DecryptedTextComponent,
        ToolbarComponent,
        Loading
    ],
    templateUrl: './mobile.html',
    styleUrl: './mobile.scss',
})
export class Mobile implements OnInit {
    folders: any[] = [];
    files: any[] = [];
    history: any[] = [];
    breadcrumbs: string = '';

    searchInput: string = '';
    allSearch: any[] = [];

    isDialogOpen = false;
    selectedFile: any = null;

    loadedImages = 0;

    ngOnInit(): void {
        this.openFolder(allFolder, true);
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
        this.selectedFile = file;
        this.isDialogOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeDialog(): void {
        this.isDialogOpen = false;
        document.body.style.overflow = '';

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
}