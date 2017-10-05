/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        login: {
            type: "string",
            required: true,
            unique: true
        },
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string',
            required: true
        },
        gender: {
            type: 'string',
            enum: ['f', 'm']
        },
        mailAddress: {
            type: 'email',
            required: true
        },
        year: { //Voir si on peut le déterminer depuis le ldap
            type: 'integer',
            enum: [1, 2, 3, 4, 5],
            defaultsTo: 1 // TODO set to required: true
        },
        speciality: {
            type: 'string',
            enum: [ //Voir si on peut le déterminer depuis le ldap
                'Automatique, Électronique',
                'Génie Biochimique',
                'Génie des Procédés',
                'Génie Mathématique Appliqué',
                'Génie Civil',
                'Génie Mécanique',
                'Génie Physique',
                'Informatique et Réseaux',
                'Aucune spécialité'
            ],
            defaultsTo: "Aucune spécialité" // TODO set to required: true
        },
        enCVPath: {
            type: 'string',
            defaultsTo: ""
        },
        frCVPath: {
            type: 'string',
            defaultsTo: ""
        },
        personalWebsite: {
            type: 'string',
            defaultsTo: ""
        },
        linkedin: {
            type: 'string',
            defaultsTo: ""
        },
        viadeo: {
            type: 'string',
            defaultsTo: ""
        },
        github: {
            type: 'string',
            defaultsTo: ""
        },
        sjdRegistered: {
            type: 'boolean',
            defaultsTo: false
        },
        sjdSession: {
            type: 'string',
            defaultsTo: ''
        },
        sjdSpeciality: {
            type: 'string',
            defaultsTo: ''
        }
    }
};
