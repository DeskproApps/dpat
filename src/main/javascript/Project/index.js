'use strict';

const path = require('path');
const SchemaRegistry = require("../Manifest/SchemaRegistry");
const DeskproProject = require('./DeskproProject');
const DeskproApiClient = require('./DeskproApiClient');

const source = path.resolve(__dirname, "../../resources/scaffold");
const binPath = path.resolve(__dirname, "../../../../node_modules/.bin");

exports = module.exports =
{
    /**
     * @returns {DeskproProject}
     */
    newInstance: function () {
        return new DeskproProject(SchemaRegistry, source, binPath);
    },
    /**
     * @param {String} dpInstanceUrl
     * @returns {DeskproApiClient}
     */
    newApiClientInstance: function (dpInstanceUrl) {
        return DeskproApiClient.createInstance(dpInstanceUrl);
    }
};