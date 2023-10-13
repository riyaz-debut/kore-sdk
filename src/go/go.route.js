'use strict';

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const GoController = require('./go.controller');
let goController = new GoController();
const shell = require('shelljs');
const slugify = require('slugify')
const moment = require('moment');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let fileName = slugify(path.parse(file.originalname).name);
        const uploadPath = process.cwd() + '/public/go/' + fileName + '-' + moment().unix();
        if (!fs.existsSync(uploadPath)) {
            shell.mkdir('-p', uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storage
});

// Import Company
router.post('/', upload.single('file'), function (req, res, next) {
    goController.createBuild(req.file).then(result => {
        res.status(result.status).json(result.data);
    }).catch(result => {
        res.status(result.status || 500).json(result.data || { message: 'Something went wrong!' });
    });
});

module.exports = router;