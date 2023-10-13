'use strict';

const config = require('../../config/app');
const FabricOperation = require('./FabricOperation');
const FabricController = new FabricOperation();

class BlockController {

    /**
     * Get Block Info
     */
    async getBlockInfo() {
        let response = await FabricController.getBlockInfo(config.user, config.channel_name);
        return response;
    }
}

module.exports = BlockController;
