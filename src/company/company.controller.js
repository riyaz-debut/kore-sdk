'use strict';

const moment = require('moment');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./company.validator');
const commonValidator = require('../common/common.validator');
const csv = require("csvtojson");
const { v4: uuidv4 } = require('uuid');

const FabricController = new FabricOperation();

class CompanyController {

    /**
     * Add a new company
     */
    async addCompany(values) {
        try {
            const data = await validator.addCompany(values);
            console.log("data is", data);
            console.log("cd is", data.cd);
            console.log(typeof 'data.cd');
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;

            if (data.verifications.length) {
                for (let i = 0; i < data.verifications.length; i++) {
                    if (data.verifications[i].verification_date) {
                        data.verifications[i].verification_date = moment(data.verifications[i].verification_date).toISOString();
                    }
                }
            }

            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddCompany', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * List the companies by requestor ID
     */
    async getCompaniesByRequestorID(data) {
        try {
            const values = await commonValidator.requestorID(data);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetAllCompaniesByRequestorID', values);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get Company by ID
     */
    async getCompanyByID(data) {
        try {
            const values = await commonValidator.ID(data);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetCompany', values);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Update the company
     */
    async updateCompany(data) {
        try {
            const values = await validator.updateCompany(data);
            values.created_at = moment().toISOString();

            if (values.verifications.length) {
                for (let i = 0; i < values.verifications.length; i++) {
                    if (values.verifications[i].verification_date) {
                        values.verifications[i].verification_date = moment(values.verifications[i].verification_date).toISOString();
                    }
                }
            }

            let request = {
                id: values.id,
                data: values
            };
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'UpdateCompany', request);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Updates the Status of the Company
     */
    async updateCompanyStatus(values, type) {
        try {
            const data = await validator.updateCompanyStatus(values);
            data.status = !!data.status || false;
            data.created_at = moment().toISOString();

            if (data.reference_details.length) {
                for (let i in data.reference_details) {
                    if (data.reference_details[i].effective_start_date) {
                        data.reference_details[i].effective_start_date = moment(data.reference_details[i].effective_start_date).toISOString();
                    }

                    if (data.reference_details[i].effective_end_date) {
                        data.reference_details[i].effective_end_date = moment(data.reference_details[i].effective_end_date).toISOString();
                    }

                    if (data.reference_details[i].authorization_date) {
                        data.reference_details[i].authorization_date = moment(data.reference_details[i].authorization_date).toISOString();
                    }
                }
            }

            let method = 'CompanyBankruptcyProceedingStatus';
            switch (type) {
                case 1:
                    method = 'CompanyBankruptcyProceedingStatus';
                    break;
                case 2:
                    method = 'CompanyRegulatoryInjunctionStatus';
                    break;
                default:
                    method = 'CompanyHoldByATSOperatorStatus';
                    break;
            }

            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, method, data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Get the management people for company
     */
    async getManagementPeopleByCompany(values) {
        try {
            const data = await commonValidator.companyID(values);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'GetManagementPeople', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Assign management people with the company
     */
    async addManagementToCompany(values) {
        try {
            const data = await validator.addManagementToCompany(values);
            data.start_date = moment(data.start_date).toISOString();
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssignManagementPeople', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Remove management from company
     */
    async removeManagementFromCompany(values) {
        try {
            const data = await validator.removeManagementFromCompany(values);
            data.end_date = moment(data.end_date).toISOString();
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'RemoveManagementPeople', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Associate Notification URL with Company
     */
    async associateNotificationURLWithCompany(values) {
        try {
            const data = await validator.associateNotificationURLWithCompany(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AssociateNotificationURLWithCompany', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Upload the CSV file
     * @returns 
     */
    async uploadCSVFile(file) {
        return this.importCompanies(file.destination + file.filename);
    }

    /**
     * Import the Companies into the system
     * @param {*} data
     */
    async importCompanies(filePath) {
        try {
            let companyData = [];
            const jsonData = await csv().fromFile(filePath);

            jsonData.forEach(function (data) {
                let company = {};
                company.cd = data.cd || '';
                company.company_id = JSON.parse(data.company_id) || [];
                company.source = {
                    source_system_id: data.source_system_id || '',
                    source_platform_id: data.source_platform_id || '',
                }
                company.verifications = JSON.parse(data.verifications) || [];
                company.other_references = JSON.parse(data.other_references) || [];
                company.created_at = moment().toISOString();
                company.status = Number.parseInt(data.status) || 0;

                if (company.verifications.length) {
                    for (let i = 0; i < company.verifications.length; i++) {
                        if (company.verifications[i].verification_date) {
                            company.verifications[i].verification_date = moment(company.verifications[i].verification_date).toISOString();
                        }
                    }
                }

                companyData.push({
                    'data': company,
                    'id': uuidv4()
                });
            });

            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'ImportCompanies', { 'data': companyData });
        } catch (error) {
            return {
                status: 400,
                data: {
                    message: error.message || "Something went wrong"
                }
            };
        }
    }
}

module.exports = CompanyController;
