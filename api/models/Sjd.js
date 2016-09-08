/**
 * Sjd.js
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
      type: 'string',
      required: true
    },
    sessionNb: {
      type: 'integer',
      required: true
    },
    specialities: {
      type: 'array',
      defaultsTo: [],
    }
  }
};
