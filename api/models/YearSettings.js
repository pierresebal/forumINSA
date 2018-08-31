/**
 * GeneralSettings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        year: {
            type: 'Integer',
            primaryKey: true,
            unique: true,
            defaultsTo: function() {return new Date().getFullYear();}
        },

        mealPrice: {
            type: 'Integer',
            required: true,
            defaultsTo: 15
        },

        forumPrice: {
            type: 'Integer',
            required: true,
            defaultsTo: 1500
        },

        sjdPrice: {
            type: 'Integer',
            required: true,
            defaultsTo: 1700
        },

        forumPricePME: {
            type: 'Integer',
            required: true,
            defaultsTo: 500
        },

        sjdPricePME: {
            type: 'Integer',
            required: true,
            defaultsTo: 600
        },

        forumPriceResearch: {
            type: 'Integer',
            required: true,
            defaultsTo: 900
        },

        sjdPriceResearch: {
            type: 'Integer',
            required: true,
            defaultsTo: 1000
        },

        forumPriceFoundation: {
            type: 'Integer',
            required: true,
            defaultsTo: 500
        },

        sjdPriceFoundation: {
            type: 'Integer',
            required: true,
            defaultsTo: 600
        },

        offerPrice: {
            type: 'Integer',
            required: true,
            defaultsTo: 0
        }
    }
};

