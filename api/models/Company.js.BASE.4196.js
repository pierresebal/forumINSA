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

      groupCompany:{
        type:'string',
        required:true
      },

      siret:{
        type:'string',
        required:true
      },

      // Contain the avenue; the number of post box...
      road:{
        type:'string',
        required:true
      },

      cityCompany:{
        type:'string',
        required:true
      },

      companyAdressPostalCode:{
        type:'string',
        required:true
      },

      companyAdressCountry:{
        type:'string',
        required:true
      },

      companyWebsiteUrl:{
        type:'string',
        required:true
      },

      companyCarreerUrl:{
        type:'string',
      },

      companyDescription:{
        type:'string',
      }



  }
};

