import { app } from 'electron';
import { developmentWindow } from './developmentWindow';

app.on('ready', () => {
    developmentWindow.open();
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
