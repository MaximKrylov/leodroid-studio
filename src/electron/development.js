/* jshint esversion: 6 */

import { app, BrowserWindow } from 'electron';

class Development {
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
        this.window = new BrowserWindow({ width: 1100, height: 800 });
        this.window.loadURL('file://' + __dirname + '/../development/index.html');
        this.window.on('closed', () => { this._onClosed(); });
    }

    openWindow() {
        app.on('ready', () => { this._createWindow(); });
        app.on('window-all-closed', () => { this._onWindowAllClosed(); });
        app.on('activate', () => { this._onActivate(); });
    }
}

export let development = new Development();
