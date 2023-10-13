const Joi = require('joi');

/**
 * Check main body
 * @param {*} data 
 * @returns 
 */
async function checkBody(data) {
    const koreChainAPISchema = Joi.object({
        API_payload: Joi.object({}).unknown(true).required(),
        API: Joi.string().allow('').required(),
    }).required();

    const notificationsSchema = Joi.object().keys({
        Recipient: Joi.string().required().uri(),
        Notification_Payload: Joi.object({}).unknown(true).required(),
        token: Joi.string().required().allow(''),
    });

    const schema = Joi.object({
        KoreChainAPI: koreChainAPISchema,
        Notifications: Joi.array().items(notificationsSchema).required(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    checkBody,
};
