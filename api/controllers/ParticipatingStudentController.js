/**
 * ParticipatingStudentController
 *
 * @description :: Server-side logic for managing participatingstudents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  login: function (req, res) {
    var data = {login: req.param('login'), password: req.param('password')}
    var request = require('request')

    request.post({url: 'https://etud.insa-toulouse.fr/~forum/FBI/connection.php', form: data}, (err, httpResponse, body) => { // Demande de connection au ldap via le script php qui renvoie '0' si la connexion echoue
      if (!err && httpResponse.statusCode === 200) {
        if (body !== '0') { // si la personne a pu se connecter au ldap
          var result = JSON.parse(body)
          var studentData = {login: result.login, firstName: result.firstName, lastName: result.lastName, studentId: result.studentId}

          ParticipatingStudent.findOne({login: result.login}).exec((err, record) => {
            if (err) {
              return res.negotiate(err)
            }
            if (!record) { // Première connexion
              ParticipatingStudent.create(studentData).exec((err, created) => {
                if (err) {
                  return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: "Si l'erreur persiste, contactez <b>contact@foruminsaentreprises.fr</b>."})
                }

                return res.view('StudentParticipation/Validated', {layout: 'layout', firstName: created.firstName})
              })
            } else {
              return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Inscription déjà effectuée', ErrorDesc: 'Vous êtes déjà inscrit. Si vous voulez vous désinscrire envoyez un mail à <b>contact@foruminsaentreprises.fr</b>.<br />Pour gérer votre profil étudiant, connectez vous en cliquant sur "Etudiant" en haut à droite de la pages.'})
            }
          })
        } else { // Personne non reconnue par le ldap
          return res.view('StudentParticipation/Participation', {layout: 'layout', loginFailed: true})
        }
      } else {
        console.log('erreur : ' + err)
      }
    })
  }

}
