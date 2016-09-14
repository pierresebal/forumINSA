// Fichier de configuration des taches
// titre: titre de la notification qui apparait quand la tache n'a pas ete faite
// msg: message affiché en dessous de la notification (supporte le html)
// checkFun: fonction de validation de la tache qui renvoie un booléen, true si la notification doit être affichée
// l'argument record de CheckFun corespond a l'enregistrement de l'entreprise courante (pour laquelle la tache est vérifiée)


module.exports.TODOtasks = [

  // Vérification de la longueur de la description
    {
      title:"Completer la description",
      msg:"Vous devez ajouter la description de votre entreprise dans la page <a href='/Company/Profile'>\"Profil\"</a> ",
      checkFun:function(record){
        //le paramètre record prends un record de la BDD entreprises
        if(record.description.length <= 300){
          return true;
        }
        else {
          return false;
        }
      }
    }
  
  // Autres vérifications à ajouter...



];
