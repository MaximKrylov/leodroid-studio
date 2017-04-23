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

ipcMain.on('open-emulator-window', (event, args) => {
    if (!emulatorWindow.opened) {
        emulatorWindow.open();
    }
});

ipcMain.on('close-emulator-window', () => {
    developmentWindow.webContents.send('emulator-window-closed');
});
