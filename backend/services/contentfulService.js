const client = require("../config/contentful");

async function getVisaInformation() {

    const response = await client.getEntries({
        content_type: "visaInformation"
    });

    return response.items;
}

module.exports = {
    getVisaInformation
};