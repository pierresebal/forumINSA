/**
 * Workshop.js
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

        theme: {
            type: 'string',
            required: true
        },    

        name: {
            type: 'string',
            required: true
        },    

        organizer: {
           type: 'string',
           required: true
        },

        startHour: {
            type: 'string',
            required: true
        },

        endHour: {
            type: 'string',
            required: true
        },

        location: {
            type: 'string',
            required: true
        },

        description: {
            type: 'string',
            required: true
        },

        places: {
            type: 'integer',
            required: true
        },

        freePlaces: {
            type: 'integer'
        }
    },

    // instantiate a blank object
    instantiate: (params) => {
        return Object.assign({
            abbreviation: '', theme: '', name: '', organizer: '', startHour: '', endHour: '', location: '', description: '', places: '', freePlaces: ''
        }, params);
    },

    // lifecycle callback
    beforeCreate: function(data, next) {

        if(data.places)
            data.freePlaces = data.places;

        next();
    }
};

