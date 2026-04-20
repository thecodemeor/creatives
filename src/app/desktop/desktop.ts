import {
    Component,
    OnInit,
    AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LogoComponent } from 'src/assets/shared/logo/logo.component';
import { NoiseComponent } from 'src/assets/shared/noise';
import { DecryptedTextComponent } from 'src/assets/shared/decrypted-text';
import { ToolbarComponent } from 'src/assets/shared/toolbar';
import { BookComponent } from 'src/assets/shared/book';

import packageJson from '../../../package.json';
import allFolder from 'src/assets/json/metadata.json';

@Component({
    selector: 'app-desktop',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NoiseComponent,
        DecryptedTextComponent,
        ToolbarComponent,
        BookComponent,
        LogoComponent
    ],
    templateUrl: './desktop.html',
    styleUrl: './desktop.scss',
})
export class Desktop implements OnInit, AfterViewInit {
    version: string = packageJson.version;

    folders: any[] = [];
    files: any[] = [];
    history: any[] = [];
    breadcrumbs: string = '';
    toDisplay: string = '';
    signal: any;
    booklet: any[] = [];
    pages: any[] = [];

    searchInput: string = '';
    allSearch: any[] = [];
    allImage: any[] = [];
    allPackage: any = allFolder.children;

    isLoading = false;

    ngOnInit(): void {
        this.openFolder(allFolder, true);
        this.allImage = this.getPackage(this.allPackage, 'folder');
    }

    ngAfterViewInit(): void {}

    openFolder(folder: any, add: boolean): void {
        if (add) {
            this.history.push(folder);
        }

        this.folders = [];
        this.files = [];

        for (const item of folder.children) {
            if (item.fileType === 'folder') {
                this.folders.push(item);
            } else if (item.fileType === 'png' || item.fileType === 'svg') {
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
        this.toDisplay = '';
        this.booklet = [];
        this.pages = [];
        this.signal = file;
        this.isLoading = true;

        if (file.folder === 'work/booklet') {
            const name = file.name.replace(/\s+/g, '').toLowerCase();
            const pageMerge = file.pages / 2;

            for (let i = 0; i < file.pages; i++) {
                const id = i + 1;
                this.pages.push(`assets/images/work/booklet/${name}/${id}.svg`);
            }

            for (let i = 0; i < pageMerge; i++) {
                const id = i + 1;
                this.booklet.push(`assets/images/work/booklet/${name}/book/${id}.png`);
            }

            // app-book has no load output yet, so don't keep loader stuck
            this.isLoading = false;
        } else {
            this.toDisplay = `assets/images/${file.folder}/${file.id}.${file.fileType}`;
        }
    }

    onDisplayLoad(): void {
        this.isLoading = false;
    }

    onDisplayError(): void {
        this.isLoading = false;
    }

    filterPackage(searchInput: string): void {
        const keyword = searchInput.toLowerCase().trim();
        this.allSearch = [];

        if (!keyword) {
            return;
        }

        for (const file of this.allImage) {
            const name = file.name.toLowerCase().trim();
            if (name.includes(keyword)) {
                this.allSearch.push(file);
            }
        }
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

    close(): void {
        this.signal = [];
        this.toDisplay = '';
        this.booklet = [];
        this.pages = [];
        this.isLoading = false;
    }

    back(): void {
        if (this.history.length <= 1) {
            return;
        }

        this.history.pop();
        const prev = this.history[this.history.length - 1];
        this.openFolder(prev, false);
    }
}