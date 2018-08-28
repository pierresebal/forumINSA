/**
 * Sells.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        year: {
            type: 'Integer',
            required: true
        },
        companySiret: {
            type: 'numeric',
            required: true
        },
        companyName: {
            type: 'string'
        },

        companyType: {
            type: 'string',
            enum: ['Entreprise classique', 'Start-up/PME', 'Organisme de recherche', 'Entreprise Fondation INSA Toulouse'],
            required: true
        },

        /* Command */
        forum: {
            type: 'boolean',
            required: true
        },
        forumPrice: {
            type: 'integer',
            required: true
        },
        sjd: {
            type: 'boolean',
            required: true
        },
        sjdPrice: {
            type: 'integer',
            required: true
        },
        moreMeal: {
            type: 'integer',
            defaultsTo: 0,
            defaultsTo: 0,
            required: true
        },
        mealPrice: {
            type: 'Integer',
            required: true
        },
        billNumber: {
            type: 'integer',
            required: true
        },
        didPay: {
            type: 'boolean',
            defaultsTo: false
        }
    },

    // lifecycle callback
    beforeValidate: (data, next) => {
        //convert to boolean
        let booleanAttribute = ['forum', 'sjd']

        for(att of booleanAttribute)
            if(typeof data[att] !== 'boolean')
                data[att] = data[att] === 'on';

        next();
    }
};
