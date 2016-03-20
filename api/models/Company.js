/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    attributes: {

      // Person in charge of the affair


      FirstName:{
        type:'string',
        required:true
      },

      LastName:{
        type:'string',
        required:'true'
      },

      Email:{
        type:'email',
        required:true,
        unique:true,
      },

      // Company account information

      Password:{
        type:"string",
        required:true
      },

      Active:{
        type:"integer",
        required:true
      },

      ActivationUrl:{
        type:'string',
        required:true
      },

      // Company informations
      CompanyName:{
        type:'string',
        required:true
      },

      CompanyGroup:{
        type:'string',
        required:true
      },

      CompanySIRET:{
        type:'string',
        required:true
      },

      // Contain the avenue; the number of post box...
      CompanyAdressRoad:{
        type:'string',
        required:true
      },

      CompanyAdressCity:{
        type:'string',
        required:true
      },

      CompanyAdressPostalCode:{
        type:'string',
        required:true
      },

      CompanyAdressCountry:{
        type:'string',
        required:true
      },

      CompanyWebsiteUrl:{
        type:'string',
        required:true
      },

      CompanyCarreerUrl:{
        type:'string',
      },

      CompanyDescription:{
        type:'string',
      }



    }
  }
};

