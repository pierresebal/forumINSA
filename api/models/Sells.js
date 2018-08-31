/**
 * Sells.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        year: {
            type: 'integer',
            required: true
        },
        companySiret: {
            type: 'string',
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
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        forumPrice: {
            type: 'integer',
            required: true,
        },
        sjd: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        sjdPrice: {
            type: 'integer',
            required: true
        },
        offer: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        offerPrice: {
            type: 'integer',
            required: true
        },
        moreMeal: {
            type: 'integer',
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


        next();
    }
};
