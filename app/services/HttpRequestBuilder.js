const { models } = require("mongoose");

const TABLEAU_API_URL = 'https://10ax.online.tableau.com/api/3.4';

module.exports.getTableauSignInBody = function (userName, password, contentUrl) {
    const xmlBodyStr = `
        <tsRequest>
            <credentials name="` + userName + `" password="` + password + `">
                <site contentUrl="` + contentUrl + `" />
            </credentials>
        </tsRequest>`;

    return xmlBodyStr;
}

module.exports.getTableauHeader = function (token = "") {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Tableau-Auth': token
        },
        timeout: 8000
    };

    return config;
}

module.exports.getTableauSignInUrl = function() {
    return (TABLEAU_API_URL + '/auth/signin');
}

module.exports.getProjectsUrl = function (siteId) {
    return (TABLEAU_API_URL + "/sites/" + siteId + "/projects");
}

module.exports.getWorkbooksUrl = function (siteId) {
    return (TABLEAU_API_URL + "/sites/" + siteId + "/workbooks");
}

module.exports.getViewsUrl = function (siteId, workbookId) {
    return (TABLEAU_API_URL + "/sites/" + siteId + "/workbooks/" + workbookId + "/views");
}

module.exports.getViewDataUrl = function (siteId, viewId) {
    return (TABLEAU_API_URL + "/sites/" + siteId + "/views/" + viewId + "/data");
}