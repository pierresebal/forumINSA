/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: 'string'
        },

        price: {
            type: 'integer'
        },

        description: {
            type: 'mediumtext',
            defaultTo: ''
        },

        available: {
            type: 'boolean',
            defaultTo: false
        },

        /**
         * array of typeCompany who can see and buy this product. This should be worked as a filter
         */
        allow: {
            type: 'array',
            defaultTo: []
        },

        // @Override
        toJson: function()  {
            let clone = this.toObject();
            if(clone.description.length > 21)
                clone.description = clone.description.substr(0,20) + ' ...';
            return clone;
        }
    }
};

