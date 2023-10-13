const Joi = require('joi');

/**
 * Add Company
 * @param {*} data 
 * @returns 
 */
async function addCompany(data) {
    const companyIdSchema = Joi.object({
        registration_id: Joi.string().required(),
        registration_domicile: Joi.string().required(),
        registration_authority: Joi.string().required(),
        registration_record_url: Joi.string().required().allow(''),
    });

    const sourceSchema = Joi.object({
        source_system_id: Joi.string().required(),
        source_platform_id: Joi.string().required(),
    });

    const verificationSchema = Joi.object({
        verification_type: Joi.string().required().allow(''),
        verifying_org: Joi.string().required().allow(''),
        verification_id: Joi.string().required().allow(''),
        verification_url: Joi.string().required().allow(''),
        verification_date: Joi.string().isoDate().required().allow(''),
    });

    const otherReferenceSchema = Joi.object({
        other_reference_id: Joi.string().required().allow(''),
        other_platform_id: Joi.string().required().allow(''),
    });

    const schema = Joi.object({
        cd: Joi.string().required().allow(''),
        company_id: Joi.array().items(companyIdSchema).required(),
        source: sourceSchema.required(),
        verifications: Joi.array().items(verificationSchema).required(),
        other_references: Joi.array().items(otherReferenceSchema).required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Update Company
 * @param {*} data 
 * @returns 
 */
async function updateCompany(data) {
    const companyIdSchema = Joi.object({
        registration_id: Joi.string().required(),
        registration_domicile: Joi.string().required(),
        registration_authority: Joi.string().required(),
        registration_domicile: Joi.string().required().allow(''),
    });

    const sourceSchema = Joi.object({
        source_system_id: Joi.string().required(),
        source_platform_id: Joi.string().required(),
    });

    const verificationSchema = Joi.object({
        verification_type: Joi.string().required().allow(''),
        verifying_org: Joi.string().required().allow(''),
        verification_id: Joi.string().required().allow(''),
        verification_url: Joi.string().required().allow(''),
        verification_date: Joi.string().isoDate().required().allow(''),
    });

    const otherReferenceSchema = Joi.object({
        other_reference_id: Joi.string().required().allow(''),
        other_platform_id: Joi.string().required().allow(''),
    });

    const schema = Joi.object({
        id: Joi.string().required().alphanum(),
        cd: Joi.string().required().allow(''),
        company_id: Joi.array().items(companyIdSchema).required(),
        source: sourceSchema.required(),
        verifications: Joi.array().items(verificationSchema).required(),
        other_references: Joi.array().items(otherReferenceSchema).required(),
    });
    return schema.validateAsync(data);
}

/**
 * Update Company Status
 * @param {*} data 
 * @returns 
 */
async function updateCompanyStatus(data) {
    const referenceSchema = Joi.object({
        authorization_reference: Joi.string().required(),
        effective_start_date: Joi.string().isoDate().required(),
        effective_end_date: Joi.string().isoDate().required().allow(''),
        authorization_date: Joi.string().isoDate().required().allow(''),
        authorizing_entity_id: Joi.string().required(),
    });

    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        status: Joi.boolean().required(),
        reference_details: Joi.array().items(referenceSchema).min(1).required(),
    });
    return schema.validateAsync(data);
}

/**
 * Assign Management People to Company
 * @param {*} data 
 * @returns 
 */
async function addManagementToCompany(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        person_id: Joi.string().required().alphanum(),
        start_date: Joi.string().isoDate().required(),
        shareholder_vote_transaction_id: Joi.string().allow('').alphanum().required(),
        role: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Remove Management People from Company
 * @param {*} data 
 * @returns 
 */
async function removeManagementFromCompany(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        person_id: Joi.string().required().alphanum(),
        end_date: Joi.string().isoDate().required(),
        role: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Asspciate Notification URL with comapny
 * @param {*} data 
 * @returns 
 */
async function associateNotificationURLWithCompany(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        url: Joi.string().required().uri(),
    });
    return schema.validateAsync(data);
}

module.exports = {
    addCompany,
    updateCompany,
    updateCompanyStatus,
    addManagementToCompany,
    removeManagementFromCompany,
    associateNotificationURLWithCompany,
};
