'use strict';

const moment = require('moment');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./service-provider.validator');
const atsValidator = require('../ats-operator/ats-operator.validator');
const commonValidator = require('../common/common.validator');

const FabricController = new FabricOperation();

class ServiceProviderController {
    /**
     * Add a service provider
     */
    async addServiceProvider(values) {
        try {
            const data = await validator.addServiceProvider(values);
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddServiceProvider', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associates Service Provider with Company
     */
    async associateServiceProviderWithCompany(values) {
        try {
            const data = await atsValidator.associateATSBDWithComapny(values);
            data.created_at = moment().toISOString();
            data.association_date = moment(data.association_date).toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateServiceProvider', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get a service provider
     */
    async getServiceProviderByID(values) {
        try {
            const data = await commonValidator.ID(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'GetServiceProviderByID', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = ServiceProviderController;
