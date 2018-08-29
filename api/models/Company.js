/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs'); // for password encryption
var SALT_WORK_FACTOR = 10;      // crypto key

/**
 * Encrypt password using bcryptjs
 * @param password: pure password
 * @param callback: function(err, encryptedPassword)
 */
function hashPassword(password, callback)   {
    bcrypt.hash(password, SALT_WORK_FACTOR, function(err, encryptedPassword) {
        callback(err, encryptedPassword);
    });
}

module.exports = {

    schema: true,

    attributes: {

        /* Contact Forum */
        firstName: {
            type: 'string',
            maxLength: 50,
            required: true
        },

        lastName: {
            type: 'string',
            maxLength: 50,
            required: true
        },

        position: { //Poste dans l'entreprise
            type: 'string',
            minLength: 1,
            maxLength: 50,
            defaultsTo: ''
        },

        mailAddress: {
            type: 'email',
            required: true,
            unique: true,
            maxLength: 150
        },

        phoneNumber: {
            type: 'number',
            regex: /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/g,
            maxLength: 17,
            defaultsTo: ''
        },

        password: {
            type: 'string',
            minLength: 6,
            regex: /^[\S\s]{0,50}/
        },

        tmpPassword: {
            type: 'string',
            minLength: 6,
            regex: /^[\S\s]{0,50}/,
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
            defaultsTo: ''
        },

        bPhoneNumber: {
            type: 'string',
            defaultsTo: ''
        },


        /* Company information */
        siret: {
            type: 'numeric',
            required: true,
            unique: true,
            minLength: 14,
            maxLength: 14,
            regex: /[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{5}/
        },

        companyName: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 50
        },

        companyGroup: {
            type: 'string',
            maxLength: 50,
            defaultsTo: ''
        },

        description: {
            type: 'mediumtext',
            defaultsTo: 'Pas de description fournie.'
        },

        websiteUrl: {
            type: 'string',
            maxLength: 200,
            defaultsTo: ''
        },

        careerUrl: {
            type: 'string',
            maxLength: 200,
            defaultsTo: ''
        },

        logoPath: {
            type: 'string'        },

        road: { //Both number and road
            type: 'string',
            maxLength: 50,
            required: true
        },

        complementaryInformation: {
            type: 'string',
            maxLength: 50,
            defaultsTo: ""
        },

        city: {
            type: 'string',
            maxLength: 200,
            required: true
        },

        postCode: {
            type: 'string',
            maxLength: 6,
            required: true
        },

        country: {
            type: 'string',
            maxLength: 50,
            required: true
        },

        /* Command */

        forum: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },

        sjd: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },

        moreMeal: {
            type: 'number',
            required: true,
            defaultsTo: ''
        },

        /* Other Information */

        blacklist: {
            type: 'boolean',
            defaultsTo: false
        },

        active: {
            type: "boolean",
            required: true,
            defaultsTo: false
        },

        activationUrl: {
            type: 'string'
        },

        /*type:   {
            type: 'string',
            enum: ['Entreprise classique', 'Start-up/PME', 'Organisme de recherche', 'Entreprise Fondation INSA Toulouse'],
            required: true
        },*/

        status: {
            model: 'CompanyStatus',
            required: true
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
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        GB: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        GP: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        GMM: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        GM: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        GPE: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        IR: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },
        GC: {
            type: 'string',
            required: true,
            defaultsTo: 'off'
        },

        specialities: {
            collection: 'speciality',
        },

        /**
         * Check password
         * @param password
         */
        verifyPassword: function(password)  {
            return bcrypt.compareSync(password, this.password);
        },

        /**
         * Check if company can book a Speed Job Dating or not.
         * The declared fields in this function have to be filled
         * @return: boolean
         */
        canBook: function() {
            return this.firstName && this.lastName && this.position && this.phoneNumber && this.mailAddress         // contact
                && this.bFirstName && this.bLastName && this.bPosition && this.bPhoneNumber && this.bMailAddress    // facturation
                && this.logoPath && this.description && this.road && this.postCode && this.country && this.city;
        },

        /**
         * Define if type of company allows to benefit a reduction
         * @return: boolean
         */
        isResearchOrganization: function()   {
            return this.status === 'Organisme de recherche';
        },

        isBenefitPromotion: function()   {
            return this.status === 'Start-up/PME' || this.status === 'Entreprise Fondation INSA Toulouse';
        },

        // @Override
        toJson: function()  {
            var clone = this.toObject();
            delete clone.password;
            delete clone._csrf;
            return clone;
        }
    },

    // instantiate a blank object
    instantiate: function(params) {
        return Object.assign({
            firstName: '', lastName: '', position:'', mailAddress: '', phoneNumber: '', password: '', siret: '', companyName: '', companyGroup: '', description: '', websiteUrl: '', careerUrl: '', road: '', complementaryInformation: '', city: '', postCode: '', country: '',
            forum: '', sjd: ''
        }, params);
    },

    // lifecycle callback
    beforeValidate: function(data, next) {

        // check phone number
        if(data.phoneNumber)
            data.phoneNumber = parseInt(data.phoneNumber);

        // check number of meal
        if(data.moreMeal)
            data.moreMeal = parseInt(data.moreMeal);

        // format url
        if (data.websiteUrl && data.websiteUrl.charAt(4) !== ':' && data.websiteUrl.charAt(5) !== ':' && data.websiteUrl !== '')
            data.websiteUrl = 'http://' + data.websiteUrl;

        if (data.careerUrl && data.careerUrl.charAt(4) !== ':' && data.careerUrl.charAt(5) !== ':' && data.careerUrl !== '')
            data.careerUrl = 'http://' + data.careerUrl;

        next();
    },

    beforeCreate: function(data, next)    {

        // Création du lien d'activation (sha1 sur chrono courrant du serveur)
        var sha1 = require('sha1');
        var date = new Date();

        data.activationUrl = sha1(date.getTime());

        hashPassword(data.tmpPassword, function(err, encryptedPassword)    {
            if(err)     {
                sails.log.error('[Company.beforeCreate] error: ', err);
                return next(err);
            }

            data.password = encryptedPassword;

            next();
        });
    },

    beforeUpdate: function(data, cb)    {
        if (data.password) {
            hashPassword(data.password, (err, encryptedPassword) =>  {
                if(err) return cb(err);

                data.password = encryptedPassword;
                return cb();
            });
        } else
            return cb();
    }
};
