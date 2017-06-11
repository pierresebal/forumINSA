/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        /* Contact Forum */
        firstName: {
            type: 'string',
            required: true
        },

        lastName: {
            type: 'string',
            required: true
        },

        position: { //Poste dans l'entreprise
            type: 'string',
            defaultsTo: ''
        },

        mailAddress: {
            type: 'email',
            required: true,
            unique: true
        },

        phoneNumber: {
            type: 'string',
            defaultsTo: ''
        },

        password: {
            type: "string",
            required: true
        },

        /* Contact Facturation */
        bFirstName: {
            type: 'string',
            defaultsTo: ''
        },

        bLastName: {
            type: 'string',
            defaultsTo: ''
        },

        bPosition: {
            type: 'string',
            defaultsTo: ''
        },

        bMailAddress: {
            type: 'email',
        },

        bPhoneNumber: {
            type: 'string',
            defaultsTo: ''
        },


        /* Company information */
        siret: {
            type: 'string',
            required: true
        },

        companyName: {
            type: 'string',
            required: true
        },

        companyGroup: {
            type: 'string',
            defaultsTo: ''
        },

        description: {
            type: 'string',
            defaultsTo: 'Pas de description fournie.'
        },

        websiteUrl: {
            type: 'string',
            defaultsTo: ''
        },

        careerUrl: {
            type: 'string',
            defaultsTo: ''
        },

        logoPath: {
            type: 'string',
            defaultsTo: ""
        },

        road: { //Both number and road
            type: 'string',
            required: true
        },

        complementaryInformation: {
            type: 'string',
            defaultsTo: ""
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

        blacklist: {
            type: 'boolean',
            defaultsTo: false
        },

        active: {
            type: "integer",
            required: true,
            defaultsTo: 0
        },

        activationUrl: {
            type: 'string',
            required: true
        },

        type:   {
            type: 'string',
            enum: ['Start-up', 'PME', 'Bureaux locaux de grand groupe', 'ETI', 'GE'],
            required: true
        },

        isPME: {
            type: 'boolean',
            required: true,
            defaultsTo: true
        },

        firstConnectionDone: {
            type: 'boolean',
            defaultsTo: false
        },

        vigipirate: {
            type: 'array',
            defaultsTo: []
        },
        //Ce qui va suivre est très moche. Il aurait fallu faire un many-to-many mais je l'ai vu trop tard et j'ai pas envie de tout rechanger car la deadline c'était il y a 3 jours.
        //Ca correspond aux spécialités qui intéressent la companie
        AE: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        GB: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        GP: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        GMM: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        GM: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        GPE: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        IR: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        GC: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },

        /**
         * Check if company can book a Speed Job Dating or not.
         * The declared fields in this function have to be filled
         * @return: boolean
         */
        canBook: function() {
            return this.firstName && this.lastName && this.position && this.phoneNumber && this.mailAddress         // contact
                && this.bFirstName && this.bLastName && this.bPosition && this.bPhoneNumber && this.bMailAddress    // facturation
                && this.logo && this.description && this.road && this.postCode && this.country && this.city;
        }
    }
};
