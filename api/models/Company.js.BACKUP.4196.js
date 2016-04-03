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

<<<<<<< HEAD
    // CompanySpace informations
    companyName:{
=======
    companyGroup:{
>>>>>>> e293c69c13cced34b4caae09c6453fb42d14955d
      type:'string',
      required:true
    },

<<<<<<< HEAD
    companyGroup:{
      type:'string',
      required:true
    },

    siret:{
=======
    description:{
      type:'string',
    },

    websiteUrl:{
>>>>>>> e293c69c13cced34b4caae09c6453fb42d14955d
      type:'string',
      required:true
    },

<<<<<<< HEAD
    // Contain the avenue; the number of post box...

    road: {
=======
    careerUrl:{
      type:'string',
    },

    logoPath:{
      type:'string',
      defaultsTo:""
    },

    road: { //Both number and road
>>>>>>> e293c69c13cced34b4caae09c6453fb42d14955d
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

<<<<<<< HEAD
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
=======
    /* Other Information */

    blacklist:{
      type:'boolean',
      defaultsTo:false
    },
>>>>>>> e293c69c13cced34b4caae09c6453fb42d14955d

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

