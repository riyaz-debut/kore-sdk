const Joi = require('joi');

/**
 * Issue Securtiies
 * @param {*} data 
 * @returns 
 */
async function issueSecurities(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        offering_memorandum_id: Joi.string().allow('').alphanum().required(),
        shareholder_agreement_id: Joi.string().allow('').alphanum().required(),
        certificate_number: Joi.string().required().allow('').required(),
        securities_type: Joi.string().required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Issue Securtiies
 * @param {*} data 
 * @returns 
 */
async function getSecuritiesByCompanyID(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        requestor_id: Joi.string().allow('').alphanum().required()
    });
    return schema.validateAsync(data);
}

/**
 * Update Securities
 * @param {*} data 
 * @returns 
 */
async function updateSecurities(data) {
    const schema = Joi.object({
        available_securities: Joi.number().required(),
        koresecurities_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}


/**
 * Add Certificate Text
 * @param {*} data 
 * @returns 
 */
async function addCertificateText(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        certificate_text: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Certificate
 * @param {*} data 
 * @returns 
 */
async function addCertificate(data) {
    const schema = Joi.object({
        koretransaction_id: Joi.string().required().alphanum(),
        company_id: Joi.string().required().alphanum(),
        securities_holder_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        certificate_number: Joi.string().required(),
        holding_amount: Joi.number().required(),
        average_price: Joi.number().required(),
        date_acquired: Joi.string().required().isoDate(),
        status: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Update Certificate
 * @param {*} data 
 * @returns 
 */
async function updateCertificate(data) {
    const schema = Joi.object({
        certificate_id: Joi.string().required().alphanum(),
        status: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Certificate
 * @param {*} data 
 * @returns 
 */
async function addSecuritiesExchangePrice(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
        quote_provider_id: Joi.string().required().alphanum(),
        exchange_unit: Joi.string().required(),
        exchange_unit_type: Joi.string().required(),
        exchange_price: Joi.number().required(),
        quote_date: Joi.string().required().isoDate(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    issueSecurities,
    updateSecurities,
    addCertificateText,
    addCertificate,
    updateCertificate,
    addSecuritiesExchangePrice,
    getSecuritiesByCompanyID,
};
