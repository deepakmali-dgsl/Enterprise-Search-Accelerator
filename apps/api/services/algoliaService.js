const client = require("../config/algolia");

async function save(records) {

    return await client.saveObjects({
        indexName: process.env.ALGOLIA_INDEX_NAME,
        objects: records
    });

}

module.exports = {
    save
};