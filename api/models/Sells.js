/**
 * Sells.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    year: {
      type:'Integer',
      required:true
    },
    companySiret : {
      type:'string',
      required:true
    },
    isPME : {
      type : 'boolean',
      required:true
    },

    /* Command */
    forum : {
      type:'boolean',
      required:true
    },
    forumPrice : {
      type:'integer',
      required:true
    },

    sjd : {
      type:'boolean',
      required:true
    },
    sjdPrice : {
      type:'integer',
      required:true
    },

    premiumPack : {
      type:'boolean',
      required:true
    },
    premiumPackPrice : {
      type:'integer',
      required:true
    },

    moreSjd : {
      type:'integer',
      required:true
    },
    moreSjdPrice : {
      type:'integer',
      required:true
    },
    moreMeal:{
      type:'integer',
      defaultsTo:0,
      required:true
    },
    mealPrice:{
      type:'Integer',
      required:true
    },
    billNumber : {
      type:'integer',
      required:true
    }
  }
};
