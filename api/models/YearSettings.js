/**
 * GeneralSettings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    year:{
      type:'Integer',
      unique:true
    },

    forumPrice:{
      type:'Integer',
      required:true,
      defaultsTo:400
    },

    sjdPrice:{
      type:'Integer',
      required:true,
      defaultsTo:200
    },

    sjdSessionPrice:{
      type:'Integer',
      required:true,
      defaultsTo:50
    },

    premiumPrice:{
      type:'Integer',
      required:true,
      defaultsTo:500
    },

    //PME
    forumPricePME:{
      type:'Integer',
      required:true,
      defaultsTo:280
    },

    sjdPricePME:{
      type:'Integer',
      required:true,
      defaultsTo:140
    },

    sjdSessionPricePME:{
      type:'Integer',
      required:true,
      defaultsTo:50
    },

    premiumPricePME:{
      type:'Integer',
      required:true,
      defaultsTo:350
    },
  }
};

