'use strict';

const path = require('path');
const DeskproProject = require('./DeskproProject');
const DeskproApiClient = require('./DeskproApiClient');

const source = path.resolve(__dirname, "../../resources/scaffold");
const binPath = path.resolve(__dirname, "../../../../node_modules/.bin");

module.exports =
{
    /**
     * @returns {DeskproProject}
     */
    newInstance: function () {
        return new DeskproProject(source, binPath);
    },
    /**
     * @param {String} dpInstanceUrl
     * @returns {DeskproApiClient}
     */
    newApiClientInstance: function (dpInstanceUrl) {
        return DeskproApiClient.createInstance(dpInstanceUrl);
    }
};