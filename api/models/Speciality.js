/**
 * Speciality.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        abbreviation: {
            type: 'string',
            required: true,
            primaryKey: true
        },

        name: {
            type: 'string',
            required: true,
        },

        insaUrl: {
            type: 'string'
        },
        /*
        students: {
            collection: 'Student',
            via: 'specialities',
        },

        companies: {
            collection: 'Company',
            via: 'specialities',
        },*/
    },

    // instantiate a blank object
    instantiate: (params) => {
        return Object.assign({
            abbreviation: '', name: ''
        }, params);
    }
};

