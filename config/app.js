'use strict';

const config = {
    channel_name: process.env.CHANNEL_NAME,
    chaincode_name: process.env.CHAINCODE_NAME,
    user: process.env.USER_NAME,
    app_url: process.env.APP_URL,
    rounds: 10,
    ca_url: process.env.CA_URL,
    org_mspid: process.env.ORG_MSPID,
    org_name: process.env.ORG_NAME,
    swaggerCredential: {
        'admin': process.env.SWAGGER_PASSWORD || 'aTK6YAx7'
    }
};

module.exports = config;
