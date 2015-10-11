import log from '../stores/LogStore';
import Winreg from 'winreg';
import path from 'path';
import util from 'util';
import Promise from 'bluebird';
import fs from 'fs';

var regKey = new Winreg({
    hive: Winreg.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

module.exports = {
    enableStartOnBoot: function(hidden) {
        switch (process.platform) {
            case 'darwin':
                return util.exec([
                    'osascript',
                    path.join(resources.resourceDir(), 'scripts/LoginItemAdd.scpt'),
                    'AlexandriaLibrarian'
                ]);
                break;
            case 'win32':
                return new Promise((resolve) => {
                    regKey.set('AlexandriaLibrarian', Winreg.REG_SZ, "\"" + require('remote').require('app').getPath('exe') + "\"", function() {
                        resolve();
                    });
                });
                break;
            case 'linux':
                break;
        };
    },
    disableStartOnBoot: function() {
        switch (process.platform) {
            case 'darwin':
                return util.exec([
                    'osascript',
                    path.join(resources.resourceDir(), 'scripts/LoginItemRemove.scpt'),
                    'AlexandriaLibrarian'
                ]);
                break;
            case 'win32':
                return new Promise((resolve) => {
                    regKey.remove('AlexandriaLibrarian', function() {
                        resolve();
                    });
                });
                break;
            case 'linux':
                break;
        };
    },
    statusStartOnBoot: function() {
        switch (process.platform) {
            case 'darwin':
                return util.exec([
                    'osascript',
                    path.join(resources.resourceDir(), 'scripts/LoginItemCheck.scpt')
                ]).then(function(stdout) {
                    return stdout == 1 ? true : false;
                });
                break;
            case 'win32':
                return new Promise((resolve) => {
                    regKey.get('AlexandriaLibrarian', function(error, item) {
                        resolve(item != null);
                    });
                });
                break;
            case 'linux':
                break;
        };

    }
};