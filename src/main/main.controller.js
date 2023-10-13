'use strict';

const axios = require('axios');
const CompanyController = require('../company/company.controller');
const ServiceProviderController = require('../service-provider/service-provider.controller');
const PersonController = require('../person/person.controller');
const IndustryController = require('../industry/industry.controller');
const KoreContractController = require('../korecontract/korecontract.controller');
const KoreSecuritiesController = require('../koresecurities/koresecurities.controller');
const TradeController = require('../trade/trade.controller');
const AtsOperatorController = require('../ats-operator/ats-operator.controller');
const BrokerdealerController = require('../broker-dealer/broker-dealer.controller');
const TransferAgentController = require('../transfer-agent/transfer-agent.controller');
const HoldingsController = require('../holdings/holdings.controller');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./main.validator');

const companyControlller = new CompanyController();
const serviceProviderController = new ServiceProviderController();
const personController = new PersonController();
const industryController = new IndustryController();
const korecontractController = new KoreContractController();
const koreSecuritiesController = new KoreSecuritiesController();
const tradeController = new TradeController();
const atsOperatorController = new AtsOperatorController();
const brokerdealerController = new BrokerdealerController();
const transferAgentController = new TransferAgentController();
const holdingsController = new HoldingsController();

class MainController {
    /**
     * Based on the request body calls the mail API
     * Calls the notification service if specified
     * @param {*} body Request body
     */
    async hitAPI(values) {
        try {
            const body = await validator.checkBody(values);
            let result;
            let isKorechainAPIHit = true;

            if (body.KoreChainAPI.API) {
                switch (body.KoreChainAPI.API) {
                    // company
                    case 'postCompany':
                        result = await companyControlller.addCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'getCompaniesByRequestorID':
                        result = await companyControlller.getCompaniesByRequestorID(body.KoreChainAPI.API_payload);
                        break;
                    case 'getCompanyByID':
                        result = await companyControlller.getCompanyByID(body.KoreChainAPI.API_payload);
                        break;
                    case 'putCompany':
                        result = await companyControlller.updateCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'putCompanyBankruptcyProceedingStatus':
                        result = await companyControlller.updateCompanyStatus(body.KoreChainAPI.API_payload, 1);
                        break;
                    case 'putCompanyRegulatoryInjunctionStatus':
                        result = await companyControlller.updateCompanyStatus(body.KoreChainAPI.API_payload, 2);
                        break;
                    case 'putCompanyHoldByATSOperatorStatus':
                        result = await companyControlller.updateCompanyStatus(body.KoreChainAPI.API_payload, 3);
                        break;
                    case 'putAssociateNotificationURLWithCompany':
                        result = await companyControlller.associateNotificationURLWithCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'importCompanies':
                        result = await companyControlller.importCompanies();
                        break;

                    case 'getManagementPeopleByCompany':
                        result = await companyControlller.getManagementPeopleByCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'postManagementToCompany':
                        result = await companyControlller.addManagementToCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'deleteManagementFromCompany':
                        result = await companyControlller.removeManagementFromCompany(body.KoreChainAPI.API_payload);
                        break;

                    // service provider
                    case 'postServiceProvider':
                        result = await serviceProviderController.addServiceProvider(body.KoreChainAPI.API_payload);
                        break;
                    case 'getServiceProviderByID':
                        result = await serviceProviderController.getServiceProviderByID(body.KoreChainAPI.API_payload);
                        break;
                    case 'putAssociateServiceProviderWithCompany':
                        result = await serviceProviderController.associateServiceProviderWithCompany(body.KoreChainAPI.API_payload);
                        break;

                    // person
                    case 'postPerson':
                        result = await personController.addPerson(body.KoreChainAPI.API_payload);
                        break;
                    case 'getPersonByID':
                        result = await personController.getPersonByID(body.KoreChainAPI.API_payload);
                        break;

                    // industry
                    case 'postIndustry':
                        result = await industryController.addIndustry(body.KoreChainAPI.API_payload);
                        break;
                    case 'getIndustries':
                        result = await industryController.getIndustries(body.KoreChainAPI.API_payload);
                        break;

                    // korecontract
                    case 'postRegisterKoreContract':
                        result = await korecontractController.addKorecontract(body.KoreChainAPI.API_payload);
                        break;
                    case 'postExecuteKoreContract':
                        result = await korecontractController.executeKorecontract(body.KoreChainAPI.API_payload);
                        break;
                    case 'postTestKoreContract':
                        result = await korecontractController.testKorecontract(body.KoreChainAPI.API_payload);
                        break;
                    case 'postDocument':
                        result = await korecontractController.addDocument(body.KoreChainAPI.API_payload);
                        break;
                    case 'postOfferingMemorandum':
                        result = await korecontractController.addOfferingMemorandum(body.KoreChainAPI.API_payload);
                        break;
                    case 'postShareholderAgreement':
                        result = await korecontractController.addShareholderAgreement(body.KoreChainAPI.API_payload);
                        break;
                    case 'postSubscriptionAgreement':
                        result = await korecontractController.addSubscriptionAgreement(body.KoreChainAPI.API_payload);
                        break;
                    case 'postPaymentMethod':
                        result = await korecontractController.addPaymentMethod(body.KoreChainAPI.API_payload);
                        break;
                    case 'postSecuritiesInstrument':
                        result = await korecontractController.addSecuritiesInstrument(body.KoreChainAPI.API_payload);
                        break;

                    // koresecurities
                    case 'postIssueSecurities':
                        result = await koreSecuritiesController.issueSecurities(body.KoreChainAPI.API_payload);
                        break;
                    case 'getSecuritiesByCompanyID':
                        result = await koreSecuritiesController.getSecuritiesByCompanyID(body.KoreChainAPI.API_payload);
                        break;
                    case 'getSecuritiesByID':
                        result = await koreSecuritiesController.getSecuritiesByID(body.KoreChainAPI.API_payload);
                        break;
                    case 'putSecurities':
                        result = await koreSecuritiesController.updateSecurities(body.KoreChainAPI.API_payload);
                        break;
                    case 'postCertificateText':
                        result = await koreSecuritiesController.addCertificateText(body.KoreChainAPI.API_payload);
                        break;
                    case 'getCertificateTextBySecuritiesID':
                        result = await koreSecuritiesController.getCertificateTextBySecuritiesID(body.KoreChainAPI.API_payload);
                        break;
                    case 'postCertificate':
                        result = await koreSecuritiesController.addCertificate(body.KoreChainAPI.API_payload);
                        break;
                    case 'putCertificate':
                        result = await koreSecuritiesController.updateCertificate(body.KoreChainAPI.API_payload);
                        break;
                    case 'postSecuritiesExchangePrice':
                        result = await koreSecuritiesController.addSecuritiesExchangePrice(body.KoreChainAPI.API_payload);
                        break;

                    // holdings
                    case 'postPurchaseKoreSecurities':
                        result = await holdingsController.purchaseKoreSecurities(body.KoreChainAPI.API_payload);
                        break;
                    case 'postTransferSecuritiesRequest':
                        result = await holdingsController.addTransferSecuritiesRequest(body.KoreChainAPI.API_payload);
                        break;
                    case 'putTransferSecuritiesRequest':
                        result = await holdingsController.updateTransferSecuritiesRequest(body.KoreChainAPI.API_payload);
                        break;
                    case 'postPlaceHoldOnShares':
                        result = await holdingsController.placeHoldOnShares(body.KoreChainAPI.API_payload);
                        break;
                    case 'postReleaseHoldOnShares':
                        result = await holdingsController.releaseHoldOnShares(body.KoreChainAPI.API_payload);
                        break;
                    case 'putHolding':
                        result = await holdingsController.updateHolding(body.KoreChainAPI.API_payload);
                        break;
                    case 'getShareHoldersByComapny':
                        result = await holdingsController.getShareHoldersByComapny(body.KoreChainAPI.API_payload);
                        break;
                    case 'getShareHoldersBySecuritiesID':
                        result = await holdingsController.getShareHoldersBySecuritiesID(body.KoreChainAPI.API_payload);
                        break;
                    case 'getTotalNumberOfSharesInHolding':
                        result = await holdingsController.getTotalNumberOfSharesInHolding(body.KoreChainAPI.API_payload);
                        break;
                    case 'getHoldingsbySecuritiesID':
                        result = await holdingsController.getHoldingsbySecuritiesID(body.KoreChainAPI.API_payload);
                        break;
                    case 'getHoldingsIDBySecuritiesID':
                        result = await holdingsController.getHoldingsIDBySecuritiesID(body.KoreChainAPI.API_payload);
                        break;
                    case 'getTradableHoldings':
                        result = await holdingsController.getTradableHoldings(body.KoreChainAPI.API_payload);
                        break;
                    case 'getShareholderSecuritiesHoldingExists':
                        result = await holdingsController.shareholderSecuritiesHoldingExists(body.KoreChainAPI.API_payload);
                        break;
                    case 'getShareholderHasAvailableShares':
                        result = await holdingsController.shareholderHasAvailableShares(body.KoreChainAPI.API_payload);
                        break;

                    // trade
                    case 'postTradeRequest':
                        result = await tradeController.addTradeRequest(body.KoreChainAPI.API_payload);
                        break;
                    case 'getTradeRequests':
                        result = await tradeController.getTradeRequests(body.KoreChainAPI.API_payload);
                        break;
                    case 'postATSTrade':
                        result = await tradeController.addATSTrade(body.KoreChainAPI.API_payload);
                        break;

                    // ats-operator
                    case 'postATSOperator':
                        result = await atsOperatorController.addATSOperator(body.KoreChainAPI.API_payload);
                        break;
                    case 'getATSOperatorByID':
                        result = await atsOperatorController.getATSOperatorByID(body.KoreChainAPI.API_payload);
                        break;
                    case 'putAssociateATSOperatorWithCompany':
                        result = await atsOperatorController.associateATSOperatorWithCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'putAssociateAtsOperatorWithSecurity':
                        result = await atsOperatorController.associateAtsOperatorWithSecurity(body.KoreChainAPI.API_payload);
                        break;

                    // broker-dealer
                    case 'postBrokerDealer':
                        result = await brokerdealerController.addBrokerDealer(body.KoreChainAPI.API_payload);
                        break;
                    case 'getBrokerDealerByID':
                        result = await brokerdealerController.getBrokerDealerByID(body.KoreChainAPI.API_payload);
                        break;
                    case 'putAssociateBrokerDealerWithCompany':
                        result = await brokerdealerController.associateBrokerDealerWithCompany(body.KoreChainAPI.API_payload);
                        break;
                    case 'putAssociateBrokerDealerWithSecurity':
                        result = await brokerdealerController.associateBrokerDealerWithSecurity(body.KoreChainAPI.API_payload);
                        break;

                    // transfer-agent
                    case 'postTransferAgent':
                        result = await transferAgentController.addTransferAgent(body.KoreChainAPI.API_payload);
                        break;
                    case 'getTransferAgentByID':
                        result = await transferAgentController.getTransferAgentByID(body.KoreChainAPI.API_payload);
                        break;
                    case 'putAssociateTransferAgentWithCompany':
                        result = await transferAgentController.associateTransferAgentWithCompany(body.KoreChainAPI.API_payload);
                        break;
                    default:
                        result = {
                            status: 400,
                            data: {
                                message: 'Korechain API method not allowed'
                            }
                        };
                        break;
                }

                if (result.status != 200) {
                    isKorechainAPIHit = false;
                }
            }

            if (body.Notifications.length && isKorechainAPIHit) {
                this.triggerNotifications(body.Notifications, result);
                if (!result) {
                    result = {
                        status: 200,
                        data: {
                            message: 'Notifications sent successfully!'
                        }
                    };
                }
            }

            if (!result) {
                result = {
                    status: 400,
                    data: {
                        message: 'Please enter valid input!'
                    }
                };
            }
            return result;
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Triggers the notifications
     * @param {*} notifications 
     * @param {*} response
     */
    async triggerNotifications(notifications, response) {
        notifications.forEach((notification) => {
            this.hitNotificationEndPoint(notification, response);
        });
    }

    /**
     * Calls the Notfication endpoint
     * @param {*} notification 
     * @param {*} response 
     */
    async hitNotificationEndPoint(notification, response) {
        if (notification.Recipient) {
            let headers = {};

            if (notification.token) {
                headers.headers = {
                    Authorization: notification.token
                };
            }

            let result = await axios.post(notification.Recipient, {
                Notification_Payload: notification.Notification_Payload,
                KoreChainAPI_Response: response || {}
            }, headers);
            console.log("Notification EndPoint result", result);
        }
    }
}

module.exports = MainController;
