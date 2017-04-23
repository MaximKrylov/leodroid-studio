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
        this.window = new BrowserWindow({ width: 400, height: 600 });

        this.window.on('closed', () => {
            this.window = null;
            developmentWindow.webContents.send('emulator-window-closed');
        });
    }
}

export let emulatorWindow = new EmulatorWindow();
