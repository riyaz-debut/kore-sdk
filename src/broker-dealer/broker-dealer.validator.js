const Joi = require('joi');

/**
 * Add Broker Dealer
 * @param {*} data 
 * @returns 
 */
async function addBrokerDealer(data) {
    const domicileSchema = Joi.object({
        country: Joi.string().required().min(2).max(2),
        state: Joi.array().items(Joi.string().required().alphanum()).min(1).required(),
    });

    const schema = Joi.object({
        broker_dealer_id: Joi.string().required(),
        source_system_id: Joi.string().required(),
        corporate_name: Joi.string().required(),
        registration_number: Joi.string().required().alphanum(),
        registration_authority: Joi.string().required().alphanum(),
        domicile: Joi.array().items(domicileSchema).required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Associate Broker Dealer with Security
 * @param {*} data 
 * @returns 
 */
async function associateBrokerDealerWithSecurity(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        broker_dealer_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addBrokerDealer,
    associateBrokerDealerWithSecurity,
};
