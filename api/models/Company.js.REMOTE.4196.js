/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /* Contact Forum */
    firstName:{
      type:'string',
      required:true
    },

    lastName:{
      type:'string',
      required:'true'
    },

    position:{ //Poste dans l'entreprise
      type:'string'
    },

    mailAddress:{
      type:'email',
      required:true,
      unique:true,
    },

    phoneNumber:{
      type:'string'
    },

    password:{
      type:"string",
      required:true
    },

    /* Contact Facturation */
    bFirstName:{
      type:'string',
      required:true
    },

    bLastName:{
      type:'string',
      required:'true'
    },

    bPosition:{
      type:'string'
    },

    bMailAddress:{
      type:'email',
      required:true,
      unique:true,
    },

    bPhoneNumber:{
      type:'string'
    },


    /* Company information */
    siret:{
      type:'string',
      required:true
    },

    companyName:{
      type:'string',
      required:true
    },

    companyGroup:{
      type:'string',
      required:true
    },

    description:{
      type:'string',
    },

    websiteUrl:{
      type:'string',
      required:true
    },

    careerUrl:{
      type:'string',
    },

    logoPath:{
      type:'string',
      defaultsTo:""
    },

    road: { //Both number and road
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

    /* Other Information */

    blacklist:{
      type:'boolean',
      defaultsTo:false
    },

    active:{
      type:"integer",
      required:true
    },

    activationUrl:{
      type:'string',
      required:true
    },

    firstConnectionDid:{
      type:'boolean',
      defaultsTo:false
    }
  }
};

