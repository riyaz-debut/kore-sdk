'use strict';

const express = require('express');
const router = express.Router();

const KoreContractController = require('./kore-contract.controller');
let korecontract = new KoreContractController();

// Show the Contract page
router.get('/', function (req, res, next) {
    res.render('korecontract');
});

// Save korecontract
router.post('/', function (req, res, next) {
    korecontract.saveKoreContract(req.body).then(result => {
        res.status(result.status).json(result.data);
    }).catch(result => {
        res.status(result.status || 500).json(result.data || { message: 'Something went wrong!' });
    });
});

module.exports = router;
