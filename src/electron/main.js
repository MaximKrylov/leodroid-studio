import { app, ipcMain } from 'electron';

import { developmentWindow } from './developmentWindow';
import { emulatorWindow } from './emulatorWindow';

app.on('ready', () => {
    developmentWindow.open();
    // developmentWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!developmentWindow.opened) {
        developmentWindow.open();
    }
});

ipcMain.on('emulator-window-will-opened', (event, args) => {
    if (!emulatorWindow.opened) {
        emulatorWindow.open();
    }
});
