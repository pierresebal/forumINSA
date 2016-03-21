/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /* COMPANY */
    siret:{
      type:'string',
      //required:true,
      unique:true,
      size: 14,
    },

    companyName:{ //Possibilité de mettre filiale ? groupe ?
      type: 'string',
      //required: true,
    },
/*
    postAddress:{
      //On peut faire des attributs d'attributs ?
    },
*/

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
/*
    logoURL:{

    },
*/
    /* CONTACT */

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


  }
};

