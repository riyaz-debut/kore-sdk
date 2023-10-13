'use strict';

const moment = require('moment');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./ats-operator.validator');
const commonValidator = require('../common/common.validator');

const FabricController = new FabricOperation();

class AtsOperatorController {
    /**
    * Add ATS Operator
    */
    async addATSOperator(values) {
        try {
            const data = await validator.addATSOperator(values);
            data.registration_date = moment(data.registration_date).toISOString();
            data.registration_expiry_date = moment(data.registration_expiry_date).toISOString();
            data.domicile = data.domicile || [];
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddATSOperator', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get the ATS Operator
     */
    async getATSOperatorByID(values) {
        try {
            const data = await commonValidator.ID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetATSOperator', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associates ATS Operator with Company
     */
    async associateATSOperatorWithCompany(values) {
        try {
            const data = await validator.associateATSBDWithComapny(values);
            data.created_at = moment().toISOString();
            data.association_date = moment(data.association_date).toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateATSOperator', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associate ATS with securities
     */
    async associateAtsOperatorWithSecurity(values) {
        try {
            const data = await validator.associateAtsOperatorWithSecurity(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateATSWithSecurity', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = AtsOperatorController;