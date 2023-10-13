const Joi = require('joi');

/**
 * Add Service Provider
 * @param {*} data 
 * @returns 
 */
async function addServiceProvider(data) {
    const schema = Joi.object({
        registration_number: Joi.string().allow('').required(),
        registration_authority: Joi.string().allow('').required(),
        legal_name: Joi.string().required().min(3).max(100),
        country: Joi.string().required().min(2).max(2),
        service_name: Joi.string().required(),
        source_system_id: Joi.string().required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addServiceProvider,
};
