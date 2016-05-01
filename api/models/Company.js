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
      required:true
    },

    position:{ //Poste dans l'entreprise
      type:'string',
      defaultsTo:''
    },

    mailAddress:{
      type:'email',
      required:true,
      unique:true
    },

    phoneNumber:{
      type:'string',
      defaultsTo:''
    },

    password:{
      type:"string",
      required:true
    },

    /* Contact Facturation */
    bFirstName:{
      type:'string',
      defaultsTo:''
    },

    bLastName:{
      type:'string',
      defaultsTo:''
    },

    bPosition:{
      type:'string',
      defaultsTo:''
    },

    bMailAddress:{
      type:'email',
      defaultsTo:''
    },

    bPhoneNumber:{
      type:'string',
      defaultsTo:''
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
      defaultsTo:''
    },

    description:{
      type:'string',
      defaultsTo:''
    },

    websiteUrl:{
      type:'string',
      defaultsTo:''
    },

    careerUrl:{
      type:'string',
      defaultsTo:''
    },

    logoPath:{
      type:'string',
      defaultsTo:""
    },

    road: { //Both number and road
      type: 'string',
      required: true
    },

    complementaryInformation : {
      type: 'string',
      defaultsTo:""
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
      required:true,
      defaultsTo:false
    },

    activationUrl:{
      type:'string',
      required:true
    },

    isPME:{
      type:'boolean',
      required:true,
      defaultsTo:true
    },

    firstConnectionDone:{
      type:'boolean',
      defaultsTo:false
    }
  }
};
