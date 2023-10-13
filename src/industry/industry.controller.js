'use strict';

const moment = require('moment');
const fs = require('fs');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./industry.validator');

const FabricController = new FabricOperation();

class IndustryController {
    /**
     * Add a new Industry
     */
    async addIndustry(values) {
        try {
            const data = await validator.addIndustry(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddIndustry', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List of Industries
     */
    async getIndustries(values) {
        try {
            console.log("values is: ", values)
            const data = await validator.industryID(values);
            console.log("Data is: ", data);
            return FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllIndustries', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Import Industries
     * @param {*} data
     */
    /* async importData(body) {
        try {
            let rawdata = JSON.parse(fs.readFileSync(`exports/${body.file}.json`));
            if (rawdata.length) {
                for (let i = 0; i < rawdata.length; i++) {
                    let industry = rawdata[i];
                    let industryDB = await this.addIndustry({
                        title: industry.text
                    });

                    if (industry.children.length) {
                        for (let j = 0; j < industry.children.length; j++) {
                            let childIndustry = industry.children[j];
                            await this.addIndustry({
                                title: childIndustry.text,
                                parent_id: industryDB.data.data.id
                            });
                        }
                    }
                }
            }

            return {
                status: 200,
                data: {
                    data: 'Industries imported'
                }
            };
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    } */
}

module.exports = IndustryController;
