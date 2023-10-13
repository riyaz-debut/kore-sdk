const Joi = require('joi');

/**
 * Add Document
 * @param {*} data 
 * @returns 
 */
async function addDocument(data) {
    const schema = Joi.object({
        document_source_id: Joi.string().required().alphanum(),
        document_hash: Joi.string().required().alphanum(),
        entity_id: Joi.string().required().alphanum(),
        hash_algorithm: Joi.string().required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Subscription Agreement
 * @param {*} data 
 * @returns 
 */
async function addSubscriptionAgreement(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        document_id: Joi.string().allow('').alphanum().required(),
        date: Joi.string().required().isoDate(),
        agreement_text: Joi.string().required(),
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Subscription Agreement
 * @param {*} data 
 * @returns 
 */
async function addShareholderAgreement(data) {
    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        document_id: Joi.string().allow('').alphanum().required(),
        status: Joi.number().required(),
    }).unknown(true);
    return schema.validateAsync(data);
}

/**
 * Add Offering Memorandum
 * @param {*} data 
 * @returns 
 */
async function addOfferingMemorandum(data) {
    const referenceSchema = Joi.object({
        reference_id: Joi.string().required().alphanum(),
        reference_name: Joi.string().required(),
    });

    const jurisdictionsSchema = Joi.object({
        country: Joi.string().required().min(2).max(2),
        state: Joi.string().allow('').min(1).max(3).required(),
    });

    const offeringDetailSchema = Joi.object({
        offering_type: Joi.string().required(),
        offering_currency: Joi.string().required().alphanum(),
        offering_amount: Joi.number().required().min(1),
        offering_securities_number: Joi.number().required().min(1),
        offering_price_per_security: Joi.number().required().min(0),
        offering_securities_class: Joi.string().allow('').required(),
        offering_start_date: Joi.string().required().isoDate(),
        offering_end_date: Joi.string().isoDate().required(),
        references: Joi.array().items(referenceSchema).required(),
    }).required();

    const schema = Joi.object({
        company_id: Joi.string().required().alphanum(),
        document_id: Joi.string().allow('').alphanum().required(),
        company_symbol: Joi.string().allow('').alphanum().min(3).max(50).required(),
        public_reporting_company: Joi.boolean().required(),
        issuance_jurisdictions: Joi.array().items(jurisdictionsSchema).required(),
        exemptions: Joi.array().items(Joi.string()).required(),
        broker_dealers: Joi.array().items(Joi.string().alphanum()).required(),
        offering_detail: offeringDetailSchema,
        status: Joi.number().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Payment Method
 * @param {*} data 
 * @returns 
 */
async function addPaymentMethod(data) {
    const schema = Joi.object({
        transaction_date: Joi.string().required().isoDate(),
        payment_type: Joi.string().required(),
        ip_address: Joi.string().required().ip(),
        payer_id: Joi.string().required().alphanum(),
        amount: Joi.string().required(),
        currency: Joi.string().required(),
        payment_method: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Securities Instrument
 * @param {*} data 
 * @returns 
 */
async function addSecuritiesInstrument(data) {
    const schema = Joi.object({
        securities_type: Joi.string().required(),
        name: Joi.string().required(),
        class_type: Joi.string().required(),
    });
    return schema.validateAsync(data);
}

/**
 * Add Korecontract
 * @param {*} data 
 * @returns 
 */
async function addKorecontract(data) {
    const keywordsSchema = Joi.object({
        keyword: Joi.string().allow('').required(),
    });

    const metaSchema = Joi.object({
        version: Joi.string().required(),
        author: Joi.string().required().alphanum(),
        company: Joi.string().required().alphanum(),
        description: Joi.string().allow('').required(),
        contract_text: Joi.string().allow('').required(),
        category: Joi.string().allow('').required(),
        subcategory: Joi.string().allow('').required(),
        keywords: Joi.array().items(keywordsSchema).required(),
        date_created: Joi.string().required().isoDate(),
        date_until: Joi.string().required().allow(''),
    }).required();

    const schema = Joi.object({
        id: Joi.string().required().alphanum(),
        rules: Joi.array().items(Joi.string().required()).required(),
        meta: metaSchema,
    });
    return schema.validateAsync(data);
}

/**
 * Execute Korecontract
 * @param {*} data 
 * @returns 
 */
async function executeKorecontract(data) {
    const schema = Joi.object({
        id: Joi.string().required().alphanum(),
        company: Joi.string().required().alphanum(),
        transaction_id: Joi.string().required().alphanum(),
        version: Joi.string().required().alphanum(),
        variables: Joi.object(),
        return_variables: Joi.array().items(Joi.string().required()).required(),
    });

    return schema.validateAsync(data);
}

async function testKorecontract(data) {
    const schema = Joi.object({
        rules: Joi.array().items(Joi.string().required()).required(),
        variables: Joi.object(),
        return_variables: Joi.array().items(Joi.string().required()).required(),
    });

    return schema.validateAsync(data);
}

module.exports = {
    addDocument,
    addOfferingMemorandum,
    addSubscriptionAgreement,
    addPaymentMethod,
    addSecuritiesInstrument,
    addShareholderAgreement,
    addKorecontract,
    executeKorecontract,
    testKorecontract,
};
