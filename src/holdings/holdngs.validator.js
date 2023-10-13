const Joi = require('joi');

/**
 * Purchase Securities
 * @param {*} data 
 * @returns 
 */
async function purchaseKoreSecurities(data) {
    const schema = Joi.object({
        source_system_id: Joi.string().required().alphanum(),
        company_id: Joi.string().required().alphanum(),
        securities_holder_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        certificate_number: Joi.string().allow('').required(),
        holding_amount: Joi.number().required(),
        average_price: Joi.number().required(),
        date_acquired: Joi.string().required().isoDate(),
    });
    return schema.validateAsync(data);
}

/**
 * Add transfer securities request
 * @param {*} data 
 * @returns 
 */
async function addTransferSecuritiesRequest(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        owner_id: Joi.string().required().alphanum(),
        transferred_to_id: Joi.string().required().alphanum(),
        transfer_authorization_transaction_id: Joi.string().required().alphanum(),
        total_securities: Joi.number().required().min(1),
        effective_date: Joi.string().required().isoDate(),
        transfer_type: Joi.string().required().allow(''),
        transfer_requestor: Joi.string().required().alphanum(),
        transfer_approver: Joi.string().required().alphanum().allow(''),
    });
    return schema.validateAsync(data);
}

/**
 * Update transfer securities request
 * @param {*} data 
 * @returns 
 */
async function updateTransferSecuritiesRequest(data) {
    const reasonSchema = Joi.object({
        reason_code: Joi.string().required().allow(''),
        reason_text: Joi.string().required().allow(''),
    }).required();
    const schema = Joi.object({
        transfer_request_id: Joi.string().required().alphanum(),
        status: Joi.number().required().min(1).max(2),
        reason: reasonSchema,
    });
    return schema.validateAsync(data);
}

/**
 * Place/Release hold on shares
 * @param {*} data 
 * @returns 
 */
async function placeHoldOnShares(data) {
    const schema = Joi.object({
        securities_holder_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        ats_id: Joi.string().required().alphanum(),
        ats_transaction_id: Joi.string().required().alphanum(),
        reason_code: Joi.string().required(),
        number_of_shares: Joi.number().required().min(0),
        last_updated_at: Joi.string().required().isoDate(),
    });
    return schema.validateAsync(data);
}

/**
 * Update holdings
 * @param {*} data 
 * @returns 
 */
async function updateHolding(data) {
    const schema = Joi.object({
        securities_holder_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        reason_code: Joi.string().required(),
        number_of_shares: Joi.number().required().min(0),
        last_updated_at: Joi.string().required().isoDate(),
    });
    return schema.validateAsync(data);
}

/**
 * Get all shareholder by company
 * @param {*} data 
 * @returns 
 */
async function getShareHoldersByComapny(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        requestor_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Get all shareholder by securities
 * @param {*} data 
 * @returns 
 */
async function getShareHoldersBySecuritiesID(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        requestor_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Get all shareholder by securities
 * @param {*} data 
 * @returns 
 */
async function getTotalNumberOfSharesInHolding(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        requestor_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        securities_holder_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Get all shareholder by securities
 * @param {*} data 
 * @returns 
 */
async function getTradableHoldings(data) {
    const schema = Joi.object({
        requestor_id: Joi.string().required().alphanum(),
        securities_holder_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Shareholder holds a particular holding or not
 * @param {*} data 
 * @returns 
 */
async function shareholderSecuritiesHoldingExists(data) {
    const schema = Joi.object({
        requestor_id: Joi.string().required().alphanum(),
        securities_holder_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Shareholder has available shares?
 * @param {*} data 
 * @returns 
 */
async function shareholderHasAvailableShares(data) {
    const schema = Joi.object({
        requestor_id: Joi.string().required().alphanum(),
        securities_holder_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        number_of_shares: Joi.number().required().min(0),
    });
    return schema.validateAsync(data);
}

module.exports = {
    purchaseKoreSecurities,
    addTransferSecuritiesRequest,
    updateTransferSecuritiesRequest,
    placeHoldOnShares,
    updateHolding,
    getShareHoldersByComapny,
    getShareHoldersBySecuritiesID,
    getTotalNumberOfSharesInHolding,
    getTradableHoldings,
    shareholderSecuritiesHoldingExists,
    shareholderHasAvailableShares,
};
