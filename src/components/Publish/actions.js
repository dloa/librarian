import async from 'async';
import {
    v1 as uuid
}
from 'node-uuid';
import moment from 'moment';
import _ from 'lodash';
import alt from '../../alt'
import Promise from 'bluebird';
import fileUtil from './utils/evalFile'
import CommonUtil from '../../utils/CommonUtil';

class publishingActions {

    constructor() {
        this.generateActions(
            'setMeta',
            'addedFiles',
            'youtubeAuthorized',
            'youtubeContent'
        );
    }

    processFiles(type, files) {
        this.dispatch();
        let queue = async.queue((file, next) => {
            switch (type) {
                case 'audio':
                    Promise.all([fileUtil.mediaInfo(file.path), fileUtil.audioTag(file.path), CommonUtil.folderSize(file.path)])
                        .spread((mediaInfo, tags = {}, size) => {
                            tags.duration = moment.duration(parseInt(mediaInfo[0]), 'ms').asMinutes().toFixed(2);
                            tags._id = uuid();
                            tags.name = file.name;
                            tags.type = type;
                            tags.size = CommonUtil.formatBytes(size);
                            this.actions.addedFiles(tags);
                            process.nextTick(next);
                        })
                        .catch(err => {
                            console.error(err);
                            process.nextTick(next);
                        });
                    break;
                case 'extra':
                    CommonUtil.folderSize(file.path)
                        .then(size => {
                            this.actions.addedFiles({
                                _id: uuid(),
                                name: file.name,
                                type: type,
                                size: CommonUtil.formatBytes(size)
                            });
                            process.nextTick(next);
                        })
                        .catch(err => {
                            console.error(err);
                            process.nextTick(next);
                        });
                    break;
                case 'cover-art':
                    CommonUtil.folderSize(file.path)
                        .then(size => {
                            this.actions.addedFiles({
                                _id: uuid(),
                                name: file.name,
                                type: type,
                                size: CommonUtil.formatBytes(size)
                            });
                            process.nextTick(next);
                        })
                        .catch(err => {
                            console.error(err);
                            process.nextTick(next);
                        });
                    break;
            }
        });

        _.forEach(files, file => {
            queue.push(file)
        });
    }

    authorize(service) {
        this.dispatch();

        switch (service) {
            case 'youtube':
                require('./utils/youtubeUtil').getAuthorization()
                    .then(() => {
                        this.actions.getContent('youtube');
                    });
                break;
        }
    }

    getContent(service) {
        this.dispatch();

        switch (service) {
            case 'youtube':
                require('./utils/youtubeUtil').getContent();
                break;
        }
    }

}


export
default alt.createActions(publishingActions);