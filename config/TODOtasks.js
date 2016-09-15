// Fichier de configuration des taches
// titre: titre de la notification qui apparait quand la tache n'a pas ete faite
// msg: message affiché en dessous de la notification (supporte le html)
// checkFun: fonction de validation de la tache qui renvoie un booléen, true si la notification doit être affichée
// l'argument record de CheckFun corespond a l'enregistrement de l'entreprise courante (pour laquelle la tache est vérifiée)


module.exports.TODOtasks = [

  // Vérification de la longueur de la description
    {
      title:"Description > 150 mots",
      msg:"La description de votre entreprise fait moins de 150 mots. Nous vous conseillons une taille entre 150 et 300 mots afin de s'adapter au mieux au le livret donné aux étudiants le jour J. Vous pouvez la modifier ici : <a href='/Company/Profile'>\"Profil\"</a>",
      checkFun:function(record){
        //le paramètre record prends un record de la BDD entreprises
        if(record.description.split(' ').length <= 150){
          return true;
        }
        else {
          return false;
        }
      }
    }

  // Autres vérifications à ajouter...



];
