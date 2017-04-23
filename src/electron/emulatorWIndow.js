import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

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
            ipcMain.emit('close-emulator-window');
            this.window = null;
        });
    }
}

export let emulatorWindow = new EmulatorWindow();
