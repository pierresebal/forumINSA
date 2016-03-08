/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    login: {
      type:"string",
      required:true,
      unique: true,
    },
    firstName:"string",
    lastName:"string",
    mailAddress:"string",
    personalWebsite:"string",
    classLevel: {
      type:'integer',
      enum:[3,4,5]
    }
  }
};

