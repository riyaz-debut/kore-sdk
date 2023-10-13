'use strict';

const moment = require('moment');
const uuidv1 = require('uuid/v1');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./holdngs.validator');

const FabricController = new FabricOperation();

class HoldingsController {
    /**
     * Purchase KoreSecurities
     */
    async purchaseKoreSecurities(values) {
        try {
            const data = await validator.purchaseKoreSecurities(values);
            data.holding_amount = Number.parseFloat(data.holding_amount) || 0;
            data.average_price = Number.parseFloat(data.average_price) || 0;
            data.certificate_number = data.certificate_number || "";
            data.date_acquired = moment(data.date_acquired).toISOString();
            data.created_at = moment().toISOString();
            data.transaction_id = uuidv1();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddHolding', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add Transfer Securities request
     */
    async addTransferSecuritiesRequest(values) {
        try {
            const data = await validator.addTransferSecuritiesRequest(values);
            data.total_securities = Number.parseFloat(data.total_securities) || 0;
            data.effective_date = moment(data.effective_date).toISOString();
            data.created_at = moment().toISOString();
            data.transaction_id = uuidv1();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'TransferSecurities', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Update Transfer Securities
     */
    async updateTransferSecuritiesRequest(values) {
        try {
            const data = await validator.updateTransferSecuritiesRequest(values);
            data.status = Number.parseInt(data.status) || 2;
            data.created_at = moment().toISOString();
            data.transaction_id = uuidv1();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'UpdateTransferSecurities', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Place hold on shares
     */
    async placeHoldOnShares(values) {
        try {
            const data = await validator.placeHoldOnShares(values);
            data.number_of_shares = Number.parseFloat(data.number_of_shares) || 0;
            data.last_updated_at = moment(data.last_updated_at).toISOString();
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'PlaceHoldOnShares', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Release hold on shares
     */
    async releaseHoldOnShares(values) {
        try {
            const data = await validator.placeHoldOnShares(values);
            data.number_of_shares = Number.parseFloat(data.number_of_shares) || 0;
            data.last_updated_at = moment(data.last_updated_at).toISOString();
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'ReleaseHoldOnShares', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Update Holding
     */
    async updateHolding(values) {
        try {
            const data = await validator.updateHolding(values);
            data.number_of_shares = Number.parseFloat(data.number_of_shares) || 0;
            data.last_updated_at = moment(data.last_updated_at).toISOString();
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'UpdateHolding', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List of all Shareholders by Company and requestor ID
     */
    async getShareHoldersByComapny(values) {
        try {
            const data = await validator.getShareHoldersByComapny(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllShareHoldersByComapny', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List of all Shareholders by Company and KoreSecurities
     */
    async getShareHoldersBySecuritiesID(values) {
        try {
            const data = await validator.getShareHoldersBySecuritiesID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllShareHolders', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Total Number of shares by Company, Securities, Shareholder ID
     */
    async getTotalNumberOfSharesInHolding(values) {
        try {
            const data = await validator.getTotalNumberOfSharesInHolding(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetNumberOfSharesInHolding', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List of Holdings by securities ID
     * @param {*} data 
     */
    async getHoldingsIDBySecuritiesID(values) {
        try {
            const data = await validator.getShareHoldersBySecuritiesID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllHoldingsbySecuritiesID', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List of Tradeable holdings
     * @param {*} data 
     */
    async getTradableHoldings(values) {
        try {
            const data = await validator.getTradableHoldings(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllTradableHoldings', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List of holdings and holdings by Company and KoreSecurities
     */
    async getHoldingsBySecuritiesID(values) {
        try {
            const data = await validator.getShareHoldersBySecuritiesID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllHoldingsByCompany', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Checks whehter the shareholder holds the holding of given securities or not
     */
    async shareholderSecuritiesHoldingExists(values) {
        try {
            const data = await validator.shareholderSecuritiesHoldingExists(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'InvestorHoldingExists', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Check available shares of a shareholder
     */
    async shareholderHasAvailableShares(values) {
        try {
            const data = await validator.shareholderHasAvailableShares(values);
            data.number_of_shares = Number.parseFloat(data.number_of_shares) || 0;
            return FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAvailableShares', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = HoldingsController;