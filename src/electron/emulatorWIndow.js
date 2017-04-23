import { BrowserWindow } from 'electron';

class EmulatorWindow {
    constructor() {
        this.window = null;
    }

    get opened() {
        return this.window;
    }

    open() {
        this.window = new BrowserWindow({ width: 400, height: 600 });
        this.window.on('closed', () => {
            this.window = null;
        });
    }
}

export let emulatorWindow = new EmulatorWindow();
