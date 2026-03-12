const { app, BrowserWindow, ipcMain, dialog, Menu, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

const store = new Store();
let mainWindow;
let currentFile = null;
let saved = true;

function createWindow() {
    const theme = store.get('theme', 'dark');

    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        title: 'Bloc-Notes',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-theme', theme);
    });

    mainWindow.on('close', (e) => {
        if (!saved) {
            e.preventDefault();
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                buttons: ['Sauvegarder', 'Ne pas sauvegarder', 'Annuler'],
                title: 'Modifications non sauvegardees',
                message: 'Vous avez des modifications non sauvegardees. Que voulez-vous faire ?'
            }).then(result => {
                if (result.response === 0) {
                    saveFile().then(() => {
                        saved = true;
                        mainWindow.destroy();
                    });
                } else if (result.response === 1) {
                    saved = true;
                    mainWindow.destroy();
                }
            });
        }
    });
}

function buildMenu() {
    const template = [
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouveau',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        currentFile = null;
                        saved = true;
                        mainWindow.webContents.send('set-content', '');
                        mainWindow.setTitle('Bloc-Notes');
                    }
                },
                {
                    label: 'Ouvrir',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => openFile()
                },
                {
                    label: 'Sauvegarder',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => saveFile()
                },
                { type: 'separator' },
                {
                    label: 'Quitter',
                    role: 'quit'
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function openFile() {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Fichiers texte', extensions: ['txt'] }]
    });
    if (result.canceled) return null;
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    currentFile = filePath;
    saved = true;
    const fileName = path.basename(filePath);
    mainWindow.setTitle('Bloc-Notes — ' + fileName);
    mainWindow.webContents.send('set-content', content);
    return content;
}

async function saveFile(content) {
    if (!content && content !== '') {
        content = await mainWindow.webContents.executeJavaScript('document.getElementById("editor").value');
    }
    if (!currentFile) {
        const result = await dialog.showSaveDialog(mainWindow, {
            filters: [{ name: 'Fichiers texte', extensions: ['txt'] }]
        });
        if (result.canceled) return;
        currentFile = result.filePath;
    }
    fs.writeFileSync(currentFile, content, 'utf-8');
    saved = true;
    const fileName = path.basename(currentFile);
    mainWindow.setTitle('Bloc-Notes — ' + fileName);
    new Notification({ title: 'Bloc-Notes', body: 'Fichier sauvegarde : ' + fileName }).show();
}

ipcMain.handle('open-file', async () => {
    return await openFile();
});

ipcMain.handle('save-file', async (e, content) => {
    await saveFile(content);
});

ipcMain.handle('content-changed', () => {
    saved = false;
});

ipcMain.handle('get-theme', () => {
    return store.get('theme', 'dark');
});

ipcMain.handle('set-theme', (e, theme) => {
    store.set('theme', theme);
});

app.whenReady().then(() => {
    buildMenu();
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});
