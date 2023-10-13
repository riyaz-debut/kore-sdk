'use strict';

const moment = require('moment');
const csv = require("csvtojson");
const { v4: uuidv4 } = require('uuid');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./person.validator');
const commonValidator = require('../common/common.validator');

const FabricController = new FabricOperation();

class PersonController {
    /**
     * Add Person
     */
    async addPerson(values) {
        try {
            const data = await validator.addPerson(values);
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;

            // Has any verifications?
            if (data.verifications) {
                if (data.verifications.kyc_verification) {
                    let kycVerification = data.verifications.kyc_verification;
                    let verificationDate = moment(kycVerification.verification_date);
                    if (!verificationDate.isBefore()) {
                        return {
                            status: 400,
                            data: {
                                message: 'Verification date must not be a future date.'
                            }
                        };
                    }

                    data.verifications.kyc_verification.verification_date = moment(kycVerification.verification_date).toISOString();

                    if (kycVerification.verification_expiry_date) {
                        data.verifications.kyc_verification.verification_expiry_date = moment(kycVerification.verification_expiry_date).toISOString();
                    }
                }
            } else {
                data.verifications = {};
            }
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddPerson', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get the Person by ID
     */
    async getPersonByID(values) {
        try {
            const data = await validator.getPerson(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetPerson', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Upload the CSV file
     * @returns 
     */
    async uploadCSVFile(file) {
        return this.importPersons(file.destination + file.filename);
    }

    /**
     * Import the Persons into the system
     * @param {*} data 
     */
    async importPersons(filePath) {
        let personData = [];
        const jsonData = await csv().fromFile(filePath);

        jsonData.forEach(function (person, index) {
            let newPerson = {};

            newPerson.created_at = moment().toISOString();
            newPerson.source_id = person.source_id || "";
            newPerson.pd = person.pd || "";

            let kycVerification = {};
            kycVerification.profile_id = person.profile_id || "";
            kycVerification.provider_id = person.provider_id || "";
            kycVerification.verification_date = moment(person.verification_date).toISOString();
            kycVerification.tid = person.tid || "";
            kycVerification.kyc_report_hash = person.kyc_report_hash || "";
            kycVerification.overall_status = person.overall_status || "";

            if (person.verification_expiry_date) {
                kycVerification.verification_expiry_date = moment(person.verification_expiry_date).toISOString();
            }

            newPerson.verifications = {
                'kyc_verification': kycVerification
            };
            newPerson.status = Number.parseInt(person.status) || 0;

            personData.push({
                'data': newPerson,
                'id': uuidv4()
            });
        });
        return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'ImportPerson', { 'data': personData });
    }
}

module.exports = PersonController;
