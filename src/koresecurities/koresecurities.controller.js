'use strict';

const moment = require('moment');
const uuidv1 = require('uuid/v1');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./koresecurities.validator');
const commonValidator = require('../common/common.validator');

const FabricController = new FabricOperation();

class KoreSecuritiesController {
    /**
     * Issue KoreSecurities
     */
    async issueSecurities(values) {
        try {
            const data = await validator.issueSecurities(values);
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'IssueSecurities', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get KoreSecurities by Company ID
     */
    async getSecuritiesByCompanyID(values) {
        try {
            const data = await validator.getSecuritiesByCompanyID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllSecurities', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get KoreSecurities ID
     */
    async getSecuritiesByID(values) {
        try {
            const data = await commonValidator.ID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetSecurities', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Update securities available count
     */
    async updateSecurities(values) {
        try {
            const data = await validator.updateSecurities(values);
            data.available_securities = Number.parseFloat(data.available_securities) || 0;
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'UpdateSecurities', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add Certificate text
     */
    async addCertificateText(values) {
        try {
            const data = await validator.addCertificateText(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddSecuritiesCertificateText', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Certificate Text by Securities ID
     */
    async getCertificateTextBySecuritiesID(values) {
        try {
            console.log("Value is: ", values)
            const data = await commonValidator.securitiesID(values);//GetAllSecuritiesCertificateTexts
            console.log("Data is: ", data)
            const chaincodeName = config.chaincode_name;
            console.log("chaincodeName is: ", chaincodeName)
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllSecuritiesCertificateTexts', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add Certificate
     */
    async addCertificate(values) {
        try {
            const data = await validator.addCertificate(values);
            data.holding_amount = Number.parseFloat(data.holding_amount) || 0;
            data.average_price = Number.parseFloat(data.average_price) || 0;
            data.date_acquired = moment(data.date_acquired).toISOString();
            data.created_at = moment().toISOString();
            data.transaction_id = uuidv1();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddCertificate', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Update Certificate
     */
    async updateCertificate(values) {
        try {
            const data = await validator.updateCertificate(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'UpdateCertificate', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Save Exchange price for securities
     */
    async addSecuritiesExchangePrice(values) {
        try {
            const data = await validator.addSecuritiesExchangePrice(values);
            data.exchange_price = Number.parseFloat(data.exchange_price) || 0;
            data.quote_date = moment(data.quote_date).toISOString();
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddSecuritiesExchangePrice', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = KoreSecuritiesController;
