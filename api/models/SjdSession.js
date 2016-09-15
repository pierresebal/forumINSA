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
        {name: 'AE', companies: [], students: []},
        {name: 'IR', companies: [], students: []},
        {name: 'GMM', companies: [], students: []},
        {name: 'GC', companies: [], students: []},
        {name: 'GM', companies: [], students: []},
        {name: 'GB', companies: [], students: []},
        {name: 'GP', companies: [], students: []},
        {name: 'GPE', companies: [], students: []},
      ]
    },
  }
};
