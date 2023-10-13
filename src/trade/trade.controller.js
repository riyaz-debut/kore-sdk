'use strict';

const moment = require('moment');
const uuidv1 = require('uuid/v1');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./trade.validator');

const FabricController = new FabricOperation();

class TradeController {
    /**
     * Add trade request
     */
    async addTradeRequest(values) {
        try {
            const data = await validator.addTradeRequest(values);
            data.order_date = moment(data.order_date).toISOString();
            data.number_to_trade = Number.parseFloat(data.number_to_trade) || 0;
            data.trade_price = Number.parseFloat(data.trade_price) || 0;
            data.limit = Number.parseFloat(data.limit) || 0;
            data.stop = Number.parseFloat(data.stop) || 0;

            if (data.order_expiry) {
                data.order_expiry = moment(data.order_expiry).toISOString();
            }
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddTradeRequest', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get all the trade requests
     */
    async getTradeRequests(values) {
        try {
            const data = await validator.getTradeRequests(values);
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'GetAllTradeRequests', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add the ATS trade
     */
    async addATSTrade(values) {
        try {
            const data = await validator.addATSTrade(values);
            data.effective_date = moment(data.effective_date).toISOString();
            data.total_securities = Number.parseFloat(data.total_securities) || 0;
            data.trade_price = Number.parseFloat(data.trade_price) || 0;
            data.created_at = moment().toISOString();
            data.transaction_id = uuidv1();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddATSTrade', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = TradeController;
