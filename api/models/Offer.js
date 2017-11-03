/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    schema:true,

    attributes: {

        name: {
            type: 'string'
        },

        price: {
            type: 'integer'
        },

        description: {
            type: 'mediumtext'
        },

        allow: {
            collection: 'companyStatus'
        },

        available: {
            type: 'boolean',
            defaultTo: false
        }
    }

};

