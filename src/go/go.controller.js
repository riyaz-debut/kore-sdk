'use strict';

const errorHandler = require('../../utils/errorhandler');
const shell = require('shelljs');
const path = require('path');
const config = require('../../config/app');

class GoController {

    /**
     * Create Go build
     * @param {*} file 
     * @returns 
     */
    async createBuild(file) {
        try {
            // Go init
            if (shell.exec('cd ' + file.destination + '&& go mod init main && go mod tidy && go mod vendor && go build').code !== 0) {
                return {
                    status: 400,
                    data: {
                        message: 'Build failed!'
                    }
                };
            }

            return {
                status: 200,
                data: {
                    message: 'Build has been created successfully!',
                    data: {
                        url: 'http://' + config.app_url + '/go/' + path.basename(file.destination) + '/main'
                    }
                }
            };
        } catch (error) {
            errorHandler.handleError(error);
        }
    }
}

module.exports = GoController;