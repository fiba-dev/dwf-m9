const algoliasearch = require("algoliasearch");

const client = algoliasearch("10L313EUMY", "56aaf6bb9d673314568dc66369b8a33f");
export const productIndex = client.initIndex("newproducts");
