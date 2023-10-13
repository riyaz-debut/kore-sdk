const Joi = require('joi');

/**
 * Add Ats Operaotr
 * @param {*} data 
 * @returns 
 */
async function addATSOperator(data) {
    const domicileSchema = Joi.object({
        country: Joi.string().required().min(2).max(2),
        state: Joi.array().items(Joi.string().required().alphanum()).min(1).required(),
    });

    const schema = Joi.object({
        ats_operator_id: Joi.string().required(),
        source_system_id: Joi.string().required(),
        corporate_name: Joi.string().required(),
        registration_number: Joi.string().required().alphanum(),
        registration_authority: Joi.string().required().alphanum(),
        type_of_license: Joi.string().required(),
        license_grant_type: Joi.string().required(),
        registration_date: Joi.string().required().isoDate(),
        registration_expiry_date: Joi.string().required().isoDate(),
        domicile: Joi.array().items(domicileSchema).required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Associate ATS/BD with Company
 * @param {*} data 
 * @returns 
 */
async function associateATSBDWithComapny(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        association_date: Joi.string().isoDate().required(),
        data: Joi.array().items(Joi.string().alphanum().required()).min(1).required(),
    });
    return schema.validateAsync(data);
}

/**
 * Associate ATS with Security
 * @param {*} data 
 * @returns 
 */
async function associateAtsOperatorWithSecurity(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        ats_operator_id: Joi.string().required().alphanum(),
        koresecurities_id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addATSOperator,
    associateATSBDWithComapny,
    associateAtsOperatorWithSecurity,
};
