/**
 * SjdSession.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    sessionId: {
      type: 'integer',
      required: true,
      unique: true
    },
    hours: {
      type: 'string',
      required: true
    },
    specialities: {
      type: 'array',
      defaultsTo: [
        {name: 'AE', companies: []},
        {name: 'IR', companies: []},
        {name: 'GMM', companies: []},
        {name: 'GC', companies: []},
        {name: 'GM', companies: []},
        {name: 'GB', companies: []},
        {name: 'GP', companies: []},
        {name: 'GPE', companies: []},
      ]
    }
  }
};
