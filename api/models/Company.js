/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    attributes: {

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
      }

    }
  }
};

