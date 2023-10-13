'use strict';

const moment = require('moment');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./transfer-agent.validator');
const commonValidator = require('../common/common.validator');

const FabricController = new FabricOperation();

class TransferAgentController {
    /**
     * Add transfer Agent
     */
    async addTransferAgent(values) {
        try {
            const data = await validator.addTransferAgent(values);
            data.domicile = data.domicile || [];
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddTransferAgent', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get the Transfer Agent
     */
    async getTransferAgentByID(values) {
        try {
            const data = await commonValidator.ID(values);
            return FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetTransferAgent', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associates Transfer Agent with Company
     */
    async associateTransferAgentWithCompany(values) {
        try {
            const data = await validator.associateTAWithComapny(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateTransferAgent', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = TransferAgentController;