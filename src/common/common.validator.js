const Joi = require('joi');

/**
 * ID
 * @param {*} data 
 * @returns 
 */
async function ID(data) {
    const schema = Joi.object({
        id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Securities ID
 * @param {*} data 
 * @returns 
 */
async function securitiesID(data) {
    const schema = Joi.object({
        koresecurities_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Requestor ID
 * @param {*} data 
 * @returns 
 */
async function requestorID(data) {
    const schema = Joi.object({
        requestor_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

/**
 * Company ID
 * @param {*} data 
 * @returns 
 */
async function companyID(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    ID,
    securitiesID,
    requestorID,
    companyID
};
