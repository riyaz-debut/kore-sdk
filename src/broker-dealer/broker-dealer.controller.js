'use strict';

const moment = require('moment');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./broker-dealer.validator');
const commonValidator = require('../common/common.validator');
const atsOperatorValidator = require('../ats-operator/ats-operator.validator');

const FabricController = new FabricOperation();

class BrokerDealerController {
    /**
     * Add Broker Dealer
     * @param {*} data 
     * @returns 
     */
    async addBrokerDealer(values) {
        try {
            const data = await validator.addBrokerDealer(values);
            data.domicile = data.domicile || [];
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddBrokerDealer', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get the Brokerdealer
     */
    async getBrokerDealerByID(values) {
        try {
            const data = await commonValidator.ID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetBrokerDealer', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associates Broker Dealer with Company
     */
    async associateBrokerDealerWithCompany(values) {
        try {
            const data = await atsOperatorValidator.associateATSBDWithComapny(values);
            data.created_at = moment().toISOString();
            data.association_date = moment(data.association_date).toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateBrokerDealer', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associate Broker with securities
     */
    async associateBrokerDealerWithSecurity(values) {
        try {
            const data = await validator.associateBrokerDealerWithSecurity(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateBrokerWithSecurity', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = BrokerDealerController;