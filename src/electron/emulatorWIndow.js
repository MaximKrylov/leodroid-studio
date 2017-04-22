import { app, BrowserWindow } from 'electron';

class EmulatorWindow {
    constructor() {
        this.window = null;
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
        this.window = new BrowserWindow({ width: 300, height: 600 });
        // this.window.loadURL('file://' + __dirname + '/../development/index.html');
        this.window.on('closed', () => { this._onClosed(); });
        //this.window.webContents.openDevTools();
    }

    open() {
        app.on('ready', () => { this._createWindow(); });
        app.on('window-all-closed', () => { this._onWindowAllClosed(); });
    }
}

export let emulatorWindow = new EmulatorWindow();
