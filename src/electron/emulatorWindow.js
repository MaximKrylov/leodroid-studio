import { BrowserWindow } from 'electron';

import { developmentWindow } from './developmentWindow';

class EmulatorWindow {
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
        this.window = new BrowserWindow({ width: 400, height: 600, resizable: false, x: 50, y: 50 });
        this.window.loadURL('file://' + __dirname + '/../app/emulator/index.html');

        this.window.on('closed', () => {
            this.window = null;

            if (developmentWindow.opened) {
                developmentWindow.webContents.send('emulator-window-did-closed');
            }
        });
    }
}

export let emulatorWindow = new EmulatorWindow();
