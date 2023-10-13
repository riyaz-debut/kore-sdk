'use strict';

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const MainController = require('./main.controller');
let mainController = new MainController();
const CompanyController = require('../company/company.controller');
let companyController = new CompanyController();
const PersonController = require('../person/person.controller');
let personController = new PersonController();
const uploadPath = process.cwd() + '/output/';

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(uploadPath)) {
            shell.mkdir('-p', uploadPath);
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storage
});

// Main API
router.post('/', function (req, res, next) {
    mainController.hitAPI(req.body).then(result => {
        res.status(result.status).json(result.data);
    }).catch(result => {
        res.status(result.status || 500).json(result.data || { message: 'Something went wrong!' });
    });
});

// Import Company
router.post('/import-company', upload.single('file'), function (req, res, next) {
    companyController.uploadCSVFile(req.file).then(result => {
        res.status(result.status).json(result.data);
    }).catch(result => {
        res.status(result.status || 500).json(result.data || { message: 'Something went wrong!' });
    });
});

// Import Persons
router.post('/import-person', upload.single('file'), function (req, res, next) {
    personController.uploadCSVFile(req.file).then(result => {
        res.status(result.status).json(result.data);
    }).catch(result => {
        res.status(result.status || 500).json(result.data || { message: 'Something went wrong!' });
    });
});

module.exports = router;