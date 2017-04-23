import { app, BrowserWindow } from 'electron';

class DevelopmentWindow {
    constructor() {
        this.window = null;
    }

    _onActivate() {
        if (this.window === null) {
            this._createWindow();
        }
    }

    _onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    _onClosed() {
        this.window = null;
    }

    _createWindow() {
        this.window = new BrowserWindow({ width: 1135, height: 800 });
        this.window.loadURL('file://' + __dirname + '/../development/index.html');
        this.window.on('closed', () => { this._onClosed(); });
        this.window.webContents.openDevTools();
    }

    open() {
        app.on('ready', () => { this._createWindow(); });
        app.on('window-all-closed', () => { this._onWindowAllClosed(); });
        app.on('activate', () => { this._onActivate(); });
    }
}

export let developmentWindow = new DevelopmentWindow();
