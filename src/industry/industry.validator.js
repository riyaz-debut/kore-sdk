const Joi = require('joi');

/**
 * Add Person
 * @param {*} data 
 * @returns 
 */
async function addIndustry(data) {
    const schema = Joi.object({
        title: Joi.string().required(),
        industry: Joi.string().allow('').required(),
        parent_id: Joi.string().allow('').alphanum().required(),
    });
    return schema.validateAsync(data);
}

/**
 * ID
 * @param {*} data 
 * @returns 
 */
async function industryID(data) {
    const schema = Joi.object({
        industry_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addIndustry,
    industryID,
};
