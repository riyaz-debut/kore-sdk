'use strict';

const config = require('../../config/app');
const FabricOperation = require('../fabric/FabricOperation');
const FabricController = new FabricOperation();
let moment = require('moment');
let fs = require('fs');

class KoreContractController {

    /**
     * Saves the KoreContract and its merkel tree in the korechain
     */
    async saveKoreContract(data) {
        let contractData = {};
        contractData.title = data.title;
        contractData.preamble_text = data.preamble_text;
        contractData.created_at = moment().toISOString();

        // Set the clauses
        if (data.hasOwnProperty('data')) {
            contractData.clauses = this.traverse(data.data);
        }

        return await FabricController.invoke(config.user, config.channel_name, config.chaincode_name, 'SaveKoreContract', contractData);
    }

    /**
     * Traverses the object
     */
    traverse(clauses) {
        // main data of clauses
        let mainData = {};
        // allowed fields to be added in the object
        let allowedFields = ['title', 'text'];
        // number of clauses
        let i = 1;

        // loop through all clauses
        Object.entries(clauses).forEach(([key, clause]) => {
            let clauseObject = {};
            // loop throught the properties of the clause
            Object.entries(clause).forEach(([field, value]) => {
                // If the field is an array and key is clause referecne then save it to the main object
                if (Array.isArray(value) && field === 'references') {
                    clauseObject[field] = Array.from(new Set(value));
                } else if (!(typeof value === 'object') && allowedFields.includes(field)) {
                    // if the data is plain stirng then save the data into the main object
                    clauseObject[field] = value;
                } else {
                    // if the field is variable data then we need to save it as an array
                    if (field === 'data') {
                        clauseObject.data = {};
                        Object.entries(value).forEach(([index, dataObject]) => {
                            clauseObject.data[dataObject.name] = dataObject.value;
                        });
                    }

                    // if the field is child object
                    if (field === 'childs') {
                        // the object is the child object and need to be saved nested
                        clauseObject.clauses = this.traverse(value);
                    }
                }
            });
            // set the clasue
            mainData[i] = clauseObject;
            // increase the clause number
            i++;
        });

        return mainData;
    }
}

module.exports = KoreContractController;
