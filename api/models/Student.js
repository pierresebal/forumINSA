/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    login: {
      type:"string",
      required:true,
      unique: true,
    },
    firstName:'string',
    lastName:'string',
    gender: {
      type: 'string',
      enum:['f','m']
    },
    mailAddress:'string',
    year: { //Voir si on peut le déterminer depuis le ldap
      type:'integer',
      enum:[1,2,3,4,5]
    },
    speciality: {
      type:'string',
      enum:[ //Voir si on peut le déterminer depuis le ldap
        'Automatique, Électronique',
        'Génie Biochimique',
        'Génie des Procédés',
        'Génie Mathématique et Modélisation',
        'Génie Mécanique',
        'Génie Physique',
        'Informatique et Réseaux',
        'Aucune spécialité'
      ]
    },
    enCVPath: {
      type:'string',
    },
    frCVPath: {
      type:'string',
    },
    personalWebsite:'string',
    linkedin:'string',
    viadeo:'string',
    github:'string',



  }
};

