/**
 * SjdWish.js
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
    workshops: {
      type: 'array',
      defaultsTo: []
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    mail: {
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
            'Génie Biologique',
            'Génie des Procédés et Environnement',
            'Mathématiques appliquées',
            'Génie Civil',
            'Génie Mécanique',
            'Génie Physique',
            'Informatique et Réseaux',
            'Aucune spécialité'
        ],
        defaultsTo: "Aucune spécialité" // TODO set to required: true
    }
  },

  // lifecycle callback
  beforeCreate: function(data, next) {

    Workshop.find().exec((err, workshop) => {
      if (err) {
          console.log('err', err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
      }
      var tmpWorkshops = []
      workshop.forEach(w => {
        let ab = w.abbreviation;
        if (data[ab] == "on") {
          tmpWorkshops.push(ab);
          Workshop.update({abbreviation: ab}, {
            freePlaces: w.freePlaces - 1
          }).exec((err) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Votre inscription s\'est mal passée et est dans un état instable. Veuillez prévenir le webmaster pour qu\'il règle le problème.'})
            }
          })
        }
      });
      data.workshops = tmpWorkshops;
      next();
    })
  }
};
