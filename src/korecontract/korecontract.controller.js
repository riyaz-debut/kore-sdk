'use strict';

const moment = require('moment');
const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const errorHandler = require('../../utils/errorhandler');
const validator = require('./korecontract.validator');

const FabricController = new FabricOperation();

class KoreContractController {

    /**
     * Add Korecontract
     */
    async addKorecontract(values) {
        try {
            const data = await validator.addKorecontract(values);
            data.created_at = moment().toISOString();
            data.meta.date_created = moment(data.meta.date_created).toISOString();

            if (data.meta.date_until) {
                data.meta.date_until = moment(data.meta.date_until).toISOString();
            } else {
                delete data.meta.date_until;
            }

            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddKorecontract', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Execute Korecontract
     */
    async executeKorecontract(values) {
        try {
            const data = await validator.executeKorecontract(values);
            data.current_date = moment().toISOString();
            data.variables = JSON.stringify(data.variables);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'ExecuteKorecontract', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Test Korecontract
     */
    async testKorecontract(values) {
        try {
            const data = await validator.testKorecontract(values);
            data.variables = JSON.stringify(data.variables);
            return await FabricController.query(config.user, config.channel_name, config.chaincode_name, 'TestKorecontract', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add Document
     */
    async addDocument(values) {
        try {
            const data = await validator.addDocument(values);
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddDocument', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add Subscription Agreement
     */
    async addSubscriptionAgreement(values) {
        try {
            const data = await validator.addSubscriptionAgreement(values);
            data.date = moment(data.date).toISOString();
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddSubscriptionAgreement', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add the Offering memorandum
     */
    async addOfferingMemorandum(values) {
        try {
            const data = await validator.addOfferingMemorandum(values);
            data.public_reporting_company = data.public_reporting_company || false;
            data.issuance_jurisdictions = data.issuance_jurisdictions || [];
            data.exemptions = data.exemptions || [];
            data.broker_dealers = data.broker_dealers || [];
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;

            // other details
            if (data.offering_detail) {
                if (data.offering_detail.offering_end_date) {
                    data.offering_detail.offering_end_date = moment(data.offering_detail.offering_end_date).toISOString();
                }

                data.offering_detail = {
                    offering_currency: data.offering_detail.offering_currency || '',
                    offering_amount: Number.parseFloat(data.offering_detail.offering_amount) || 0,
                    offering_securities_number: Number.parseFloat(data.offering_detail.offering_securities_number) || 0,
                    offering_price_per_security: Number.parseFloat(data.offering_detail.offering_price_per_security) || 0,
                    offering_securities_class: data.offering_detail.offering_securities_class || "",
                    references: data.offering_detail.references || [],
                    offering_start_date: moment(data.offering_detail.offering_start_date).toISOString()
                };
            }

            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddOfferingMemorandum', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add the Shareholder Agreement
     */
    async addShareholderAgreement(body) {
        console.log("body is :", body);
        try {
            let data = {
                beneficiaries: body.beneficiaries || [],
                company_id: body.company_id || '',
                document_id: body.document_id || '',
            };

            console.log("data is :", data);

            let reports = body.reports || [];
            let disclosures = body.disclosures || [];
            let notifications = body.notifications || [];

            if (body.transfer) {
                data.transfer = {
                    transfer_restriction: !!body.transfer.transfer_restriction || false,
                    transfer_restriction_number: Number.parseInt(body.transfer.transfer_restriction_number) || 0,
                    transfer_restriction_unit: Number.parseInt(body.transfer.transfer_restriction_unit) || 0,
                    transfer_restriction_start: moment(body.transfer.transfer_restriction_start).toISOString()
                };
            }

            if (data.beneficiaries.length) {
                for (let i in data.beneficiaries) {
                    data.beneficiaries[i] = {
                        beneficiary_id: data.beneficiaries[i].beneficiary_id || '',
                        beneficiary_type: Number.parseInt(data.beneficiaries[i].beneficiary_type) || 0,
                    };
                }
            }

            if (body.trading) {
                data.trading = {};
                let ats = body.trading.ats || [];

                if (ats.length) {
                    for (let i in ats) {
                        ats[i] = {
                            ats_id: ats[i].ats_id || '',
                            ats_jurisdictions: {
                                country: ats[i].ats_jurisdictions.country || '',
                                state: ats[i].ats_jurisdictions.state || ''
                            },
                        };
                    }
                }

                data.trading.ats = ats;

                if (body.trading.trading_restrictions) {
                    let tradingRestrictions = body.trading.trading_restrictions;

                    if (tradingRestrictions.trading_hold_period) {
                        let holdPeriod = tradingRestrictions.trading_hold_period;

                        holdPeriod = {
                            trading_hold_period_duration: Number.parseInt(holdPeriod.trading_hold_period_duration) || 0,
                            trading_hold_period_duration_unit: Number.parseInt(holdPeriod.trading_hold_period_duration_unit) || 0,
                            trading_hold_period_start: moment(holdPeriod.trading_hold_period_start).toISOString(),
                            references: holdPeriod.references || []
                        };

                        if (holdPeriod.references.length) {
                            for (let i in holdPeriod.references) {
                                holdPeriod.references[i] = {
                                    reference_id: holdPeriod.references[i].reference_id || '',
                                    reference_name: holdPeriod.references[i].reference_name || '',
                                    reference_clause: holdPeriod.references[i].reference_clause || '',
                                };
                            }
                        }

                        tradingRestrictions.trading_hold_period = holdPeriod;
                    }

                    if (tradingRestrictions.trading_frequency) {
                        let tradingFrequency = tradingRestrictions.trading_frequency;
                        tradingFrequency = {
                            number_of_trades: Number.parseInt(tradingFrequency.number_of_trades) || 0,
                            trade_frequency_every: Number.parseInt(tradingFrequency.trade_frequency_every) || 0,
                            trade_frequency_unit: Number.parseInt(tradingFrequency.trade_frequency_unit) || 0
                        };

                        tradingRestrictions.trading_frequency = tradingFrequency;
                    }

                    if (tradingRestrictions.trading_quantity) {
                        let tradingQuantity = tradingRestrictions.trading_quantity;
                        tradingQuantity = {
                            trading_quantity_basis: tradingQuantity.trading_quantity_basis || "",
                            maximum_number_of_securities_to_trade: Number.parseInt(tradingQuantity.maximum_number_of_securities_to_trade) || 0,
                        };

                        tradingRestrictions.trading_quantity = tradingQuantity;
                    }

                    let salesToJurisdictions = tradingRestrictions.sale_to_jurisdictions || [];

                    if (salesToJurisdictions.length) {
                        for (let i in salesToJurisdictions) {
                            salesToJurisdictions[i] = {
                                restriction_type: salesToJurisdictions[i].restriction_type || "",
                                country: salesToJurisdictions[i].country || '',
                                state: salesToJurisdictions[i].state || ''
                            };
                        }

                        tradingRestrictions.sale_to_jurisdictions = salesToJurisdictions;
                    }

                    data.trading.trading_restrictions = tradingRestrictions;
                }

            }

            if (body.voting) {
                data.voting = {
                    exists: !!body.voting.exists || false
                };

                if (body.voting.voting_basis) {
                    let votingBasis = body.voting.voting_basis;
                    votingBasis = {
                        voting_basis_name: votingBasis.voting_basis_name || '',
                        references: votingBasis.references || []
                    };

                    if (votingBasis.references.length) {
                        for (let i in votingBasis.references) {
                            votingBasis.references[i] = {
                                reference_id: votingBasis.references[i].reference_id || '',
                                reference_name: votingBasis.references[i].reference_name || '',
                                reference_clause: votingBasis.references[i].reference_clause || '',
                            };
                        }
                    }

                    data.voting.voting_basis = votingBasis;
                }

                let votingActions = body.voting.voting_actions || [];

                if (votingActions.length) {
                    for (let j in votingActions) {
                        votingActions[j] = {
                            corporate_action: votingActions[j].corporate_action || '',
                            references: votingActions[j].references || []
                        };

                        if (votingActions[j].references.length) {
                            for (let i in votingActions[j].references) {
                                votingActions[j].references[i] = {
                                    reference_id: votingActions[j].references[i].reference_id || '',
                                    reference_name: votingActions[j].references[i].reference_name || '',
                                    reference_clause: votingActions[j].references[i].reference_clause || '',
                                };
                            }
                        }
                    }
                }

                data.voting.voting_actions = votingActions;
            }

            if (body.rights) {
                data.rights = {};

                if (body.rights.right_of_first_refusal) {
                    let rightfFirstRefusal = body.rights.right_of_first_refusal;
                    rightfFirstRefusal = {
                        exists: !!rightfFirstRefusal.exists || false
                    };

                    data.rights.right_of_first_refusal = rightfFirstRefusal;
                }

                if (body.rights.right_of_tag_along) {
                    let rightfFirstRefusal = body.rights.right_of_tag_along;
                    rightfFirstRefusal = {
                        exists: !!rightfFirstRefusal.exists || false
                    };

                    data.rights.right_of_tag_along = rightfFirstRefusal;
                }

                if (body.rights.right_of_drag_along) {
                    let rightOfDragAlong = body.rights.right_of_drag_along;
                    rightOfDragAlong = {
                        exists: !!rightOfDragAlong.exists || false
                    };

                    data.rights.right_of_drag_along = rightOfDragAlong;
                }

                if (body.rights.right_of_preemption) {
                    let rightOfPreemption = body.rights.right_of_preemption;
                    rightOfPreemption = {
                        exists: !!rightOfPreemption.exists || false
                    };

                    data.rights.right_of_preemption = rightOfPreemption;
                }

                if (body.rights.offer_of_warrants) {
                    let offerOfWarrants = body.rights.offer_of_warrants;
                    offerOfWarrants = {
                        exists: !!offerOfWarrants.exists || false
                    };

                    data.rights.offer_of_warrants = offerOfWarrants;
                }
            }

            if (body.financial_participation) {
                let financialParticipation = body.financial_participation;

                if (financialParticipation.revenue_share) {
                    let requestData = financialParticipation.revenue_share;
                    requestData = {
                        exists: !!requestData.exists || false,
                        description: requestData.description || '',
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    financialParticipation.revenue_share = requestData;
                }

                if (financialParticipation.dividends) {
                    let requestData = financialParticipation.dividends;
                    requestData = {
                        exists: !!requestData.exists || false,
                        description: requestData.description || '',
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    financialParticipation.dividends = requestData;
                }

                if (financialParticipation.warrants) {
                    let requestData = financialParticipation.warrants;
                    requestData = {
                        exists: !!requestData.exists || false,
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    financialParticipation.warrants = requestData;
                }

                if (financialParticipation.preferreds) {
                    let requestData = financialParticipation.preferreds;
                    requestData = {
                        exists: !!requestData.exists || false,
                        description: requestData.description || '',
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    financialParticipation.preferreds = requestData;
                }

                data.financial_participation = financialParticipation;
            }

            if (notifications.length) {
                for (let i in notifications) {
                    let notification = notifications[i];
                    notification = {
                        trigger: notification.trigger || '',
                        notification_title: notification.notification_title || '',
                        notification_mandatory: !!notification.notification_mandatory || false,
                        references: notification.references || [],
                    };

                    if (notification.references.length) {
                        for (let j in notification.references) {
                            notification.references[j] = {
                                reference_id: notification.references[j].reference_id || '',
                                reference_name: notification.references[j].reference_name || '',
                                reference_clause: notification.references[j].reference_clause || '',
                            };
                        }
                    }

                    notifications[i] = notification;
                }
            }

            if (body.exits) {
                let exits = body.exits;

                if (exits['M&A']) {
                    let requestData = exits['M&A'];
                    requestData = {
                        exists: !!requestData.exists || false,
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    exits['M&A'] = requestData;
                }

                if (exits.bankruptcy) {
                    let requestData = exits.bankruptcy;
                    requestData = {
                        exists: !!requestData.exists || false,
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    exits.bankruptcy = requestData;
                }

                if (exits.RTO) {
                    let requestData = exits.RTO;
                    requestData = {
                        exists: !!requestData.exists || false,
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    exits.RTO = requestData;
                }

                if (exits.IPO) {
                    let requestData = exits.IPO;
                    requestData = {
                        exists: !!requestData.exists || false,
                        references: requestData.references || []
                    };

                    if (requestData.references.length) {
                        for (let i in requestData.references) {
                            requestData.references[i] = {
                                reference_id: requestData.references[i].reference_id || '',
                                reference_name: requestData.references[i].reference_name || '',
                                reference_clause: requestData.references[i].reference_clause || '',
                            };
                        }
                    }

                    exits.IPO = requestData;
                }

                data.exits = exits;
            }

            if (reports.length) {
                for (let i in reports) {
                    let report = reports[i];

                    report = {
                        report_id: report.report_id || '',
                        report_title: report.report_title || '',
                        report_frequency: report.report_frequency || '',
                        report_consumers: report.report_consumers || [],
                    };

                    if (report.report_consumers.length) {
                        for (let j in report.report_consumers) {
                            report.report_consumers[i] = {
                                report_consumer_id: report.report_consumers[j].report_consumer_id || '',
                                report_consumer_name: report.report_consumers[j].report_consumer_name || '',
                                report_consumer_type: report.report_consumers[j].report_consumer_type || '',
                            };
                        }
                    }
                    reports[i] = report;
                }
            }


            if (disclosures.length) {
                for (let i in disclosures) {
                    let disclosure = disclosures[i];

                    disclosure = {
                        disclosure_id: disclosure.disclosure_id || '',
                        disclosure_title: disclosure.disclosure_title || '',
                        disclosure_frequency: Number.parseInt(disclosure.disclosure_frequency) || 0,
                        disclosure_frequency_unit: Number.parseInt(disclosure.disclosure_frequency_unit) || 0,
                        disclosure_recipients: disclosure.disclosure_recipients || [],
                    };

                    if (disclosure.disclosure_recipients.length) {
                        for (let j in disclosure.disclosure_recipients) {
                            disclosure.disclosure_recipients[i] = {
                                disclosure_recipient_id: disclosure.disclosure_recipients[j].disclosure_recipient_id || '',
                                disclosure_recipient_name: disclosure.disclosure_recipients[j].disclosure_recipient_name || '',
                                disclosure_recipient_type: disclosure.disclosure_recipients[j].disclosure_recipient_type || '',
                            };
                        }
                    }

                    disclosures[i] = disclosure;
                }
            }

            data.disclosures = disclosures;
            data.reports = reports;
            data.notifications = notifications;
            data.created_at = moment().toISOString();
            data.status = Number.parseInt(data.status) || 0;

            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddShareHolderAgreement', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add the payment method
     */
    async addPaymentMethod(values) {
        try {
            const data = await validator.addPaymentMethod(values);
            data.transaction_date = moment(data.transaction_date).toISOString();
            data.amount = Number.parseFloat(data.amount) || 0;
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddPaymentMethod', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }

    /**
     * Add Securities Instrument
    */
    async addSecuritiesInstrument(values) {
        try {
            const data = await validator.addSecuritiesInstrument(values);
            data.created_at = moment().toISOString();
            return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'AddSecuritiesInstrument', data);
        } catch (error) {
            return errorHandler.handleError(error);
        }
    }
}

module.exports = KoreContractController;
