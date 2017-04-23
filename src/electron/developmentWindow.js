import { BrowserWindow } from 'electron';

class DevelopmentWindow {
    constructor() {
        this.window = null;
    }

    get opened() {
        return this.window !== null && this.window !== undefined;
    }

    get webContents() {
        return this.window.webContents;
    }

    open() {
        this.window = new BrowserWindow({ width: 1135, height: 800 });
        this.window.loadURL('file://' + __dirname + '/../development/index.html');

        this.window.on('closed', () => {
            this.window = null;
        });
    }
}

export let developmentWindow = new DevelopmentWindow();
