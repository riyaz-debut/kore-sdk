const Joi = require('joi');

/**
 * Add Person
 * @param {*} data 
 * @returns 
 */
async function addPerson(data) {
    const kycVerificationSchema = Joi.object({
        provider_id: Joi.string().required().alphanum(),
        profile_id: Joi.string().allow('').required(),
        verification_date: Joi.string().required().isoDate(),
        verification_expiry_date: Joi.string().isoDate().required().allow(''),
        tid: Joi.string().required().alphanum(),
        overall_status: Joi.string().required(),
        kyc_report_hash: Joi.string().required(),
    }).required();

    const verificationSchema = Joi.object({
        kyc_verification: kycVerificationSchema
    }).required();

    const schema = Joi.object({
        pd: Joi.string().required(),
        source_id: Joi.string().required().allow(''),
        verifications: verificationSchema,
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Person
 * @param {*} data 
 * @returns 
 */
async function getPerson(data) {
    const schema = Joi.object({
        id: Joi.string().required().alphanum(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addPerson,
    getPerson,
};
