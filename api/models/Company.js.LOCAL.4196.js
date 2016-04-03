/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    firstName:{
      type:'string',
      required:true
    },

    lastName:{
      type:'string',
      required:'true'
    },

    mailAddress:{
      type:'email',
      required:true,
      unique:true,
    },

    password:{
      type:"string",
      required:true
    },

    active:{
      type:"integer",
      required:true
    },

    activationUrl:{
      type:'string',
      required:true
    },

    // CompanySpace informations
    companyName:{
      type:'string',
      required:true
    },

    companyGroup:{
      type:'string',
      required:true
    },

    siret:{
      type:'string',
      required:true
    },

    // Contain the avenue; the number of post box...

    road: {
      type: 'string',
      required: true
    },

    city: {
      type: 'string',
      required: true
    },

    postCode: {
      type: 'string',
      required: true
    },

    country: {
      type: 'string',
      required: true
    },

    websiteUrl:{
      type:'string',
      required:true
    },

    careerUrl:{
      type:'string',
    },

    description:{
      type:'string',
    }



  }
};

