import { BrowserWindow } from 'electron';

class DevelopmentWindow {
    constructor() {
        this.window = null;
    }

    get opened() {
        return this.window;
    }

    open() {
        this.window = new BrowserWindow({ width: 1135, height: 800 });
        this.window.loadURL('file://' + __dirname + '/../development/index.html');
        this.window.on('closed', () => {
            this.window = null;
        });
        // this.window.webContents.openDevTools();
    }
}

export let developmentWindow = new DevelopmentWindow();
