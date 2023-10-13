const Joi = require('joi');

/**
 * Add Trade Request
 * @param {*} data 
 * @returns 
 */
async function addTradeRequest(data) {
    const schema = Joi.object({
        shareholder_id: Joi.string().required().alphanum(),
        order_date: Joi.string().required().isoDate(),
        direction: Joi.string().required(),
        company_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        number_to_trade: Joi.number().required().min(1),
        trade_price: Joi.number().required().min(0),
        order_type: Joi.string().required(),
        stop: Joi.number().min(0).required().allow(''),
        limit: Joi.number().min(0).required().allow(''),
        order_duration: Joi.string().allow('').required(),
        order_expiry: Joi.string().isoDate().required().allow(''),
        misc: Joi.string().allow('').required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Trade Request
 * @param {*} data 
 * @returns 
 */
async function addATSTrade(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        requestor_id: Joi.string().required().alphanum(),
        ats_transaction_id: Joi.string().required().alphanum(),
        owner_id: Joi.string().required().alphanum(),
        transferred_to_id: Joi.string().required().alphanum(),
        transfer_authorization_transaction_id: Joi.string().required().alphanum(),
        effective_date: Joi.string().required().isoDate(),
        total_securities: Joi.number().required().min(1),
        trade_price: Joi.number().required().min(0),
    });
    return schema.validateAsync(data);
}

/**
 * Add Trade Request
 * @param {*} data 
 * @returns 
 */
async function getTradeRequests(data) {
    const schema = Joi.object({
        shareholder_id: Joi.string().required().alphanum(),
        company_id: Joi.string().required().alphanum(),
        requestor_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addTradeRequest,
    getTradeRequests,
    addATSTrade,
};
