var CriteriaBox =  React.createClass({

  getInitialState: function() {
    //return {specialities: []};
    return {AE:false, GB:false, GPE:false, GMM:false, GM:false, GP:false, IR:false, AS:false, A1:false, A2:false, A3:false, A4:false, A5:false, All:false, frCV:false, enCV:false}
  },
/*
  componentDidMount : function() {
    $.ajax({
      url:'/Student/Specialities',
      dataType: 'json',
      cache: false,
      success : function(specialities) {
        this.setState({specialities: specialities});
      }.bind(this),
      error : function(xhr, status, err) {
        console.error('/Student/Specialities', status, err.toString());
      }.bind(this)
    });
  }, */

  handleCheckAE : function(e) {this.setState({AE:e.target.checked});},
  handleCheckGB : function(e) {this.setState({GB:e.target.checked});},
  handleCheckGPE : function(e) {this.setState({GPE:e.target.checked});},
  handleCheckGMM : function(e) {this.setState({GMM:e.target.checked});},
  handleCheckGM : function(e) {this.setState({GM:e.target.checked});},
  handleCheckGP : function(e) {this.setState({GP:e.target.checked});},
  handleCheckIR : function(e) {this.setState({IR:e.target.checked});},
  handleCheckAS : function(e) {this.setState({AS:e.target.checked});},
  handleCheckA1 : function(e) {this.setState({A1:e.target.checked});},
  handleCheckA2 : function(e) {this.setState({A2:e.target.checked});},
  handleCheckA3 : function(e) {this.setState({A3:e.target.checked});},
  handleCheckA4 : function(e) {this.setState({A4:e.target.checked});},
  handleCheckA5 : function(e) {this.setState({A5:e.target.checked});},
  handleCheckAll : function(e) {this.setState({All:e.target.checked});},
  handleCheckFrCV : function(e) {this.setState({frCV:e.target.checked});},
  handleCheckEnCV : function(e) {this.setState({enCV:e.target.checked});},


  onSearchSubmit : function(e) {
    e.preventDefault();
    var specialitiesSearch = [];
    var yearsSearch = [];

    if (this.state.AE)
      specialitiesSearch.push('Automatique, Électronique');
    if (this.state.GB)
      specialitiesSearch.push('Génie Biochimique');
    if (this.state.GPE)
      specialitiesSearch.push('Génie des Procédés');
    if (this.state.GMM)
      specialitiesSearch.push('Génie Mathématique et Modélisation');
    if (this.state.GM)
      specialitiesSearch.push('Génie Mécanique');
    if (this.state.GP)
      specialitiesSearch.push('Génie Physique');
    if (this.state.IR)
      specialitiesSearch.push('Informatique et Réseaux');
    if (this.state.AS)
      specialitiesSearch.push('Aucune spécialité');

    var All = this.state.All;

    if (this.state.A1)
      yearsSearch.push('1');
    if (this.state.A2)
      yearsSearch.push('2');
    if (this.state.A3)
      yearsSearch.push('3');
    if (this.state.A4)
      yearsSearch.push('4');
    if (this.state.A5)
      yearsSearch.push('5');

    var frCV=this.state.frCV;
    var enCV=this.state.enCV;

    console.log("specialitiesSearch : " + specialitiesSearch);
    console.log("yearSearch : " + yearsSearch);
    this.props.onSearch(specialitiesSearch,yearsSearch,All,frCV,enCV);
  },


  render : function() {
    /* var criteriaList = this.state.specialities.map(function(speciality){
      return (
        <tr >
          <td>
            <input type="checkbox" name={speciality}/> <label>{speciality}</label>
          </td>
        </tr>
      );
    }); */

    return( //Todo : A automatiser
      <div className="CriteriaBox">
        <h2>Critères</h2>
        <form onSubmit={this.onSearchSubmit}>
          <p>Spécialités :</p>
          <table>
            <tbody>
              <tr>
                <td><input id="AE" type="checkbox" name='Automatique, Électronique' onClick={this.handleCheckAE}/> <label>Automatique, Électronique</label></td>
                <td><input id="GB" type="checkbox" name='Génie Biochimique' onClick={this.handleCheckGB}/> <label>Génie Biochimique</label></td>
              </tr>
              <tr>
                <td><input id="GPE" type="checkbox" name='Génie des Procédés' onClick={this.handleCheckGPE}/> <label>Génie des Procédés</label></td>
                <td><input id="GMM" type="checkbox" name='Génie Mathématique et Modélisation' onClick={this.handleCheckGMM}/> <label>Génie Mathématique et Modélisation</label></td>
              </tr>
              <tr>
                <td><input id="GM" type="checkbox" name='Génie Mécanique' onClick={this.handleCheckGM}/> <label>Génie Mécanique</label></td>
                <td><input id="GP" type="checkbox" name='Génie Physique' onClick={this.handleCheckGP}/> <label>Génie Physique</label></td>
              </tr>
              <tr>
                <td><input id="IR" type="checkbox" name='Informatique et Réseaux' onClick={this.handleCheckIR}/> <label>Informatique et Réseaux</label></td>
                <td><input id="AS" type="checkbox" name='Aucune spécialité' onClick={this.handleCheckAS}/> <label>Aucune spécialité</label></td>
              </tr>
            </tbody>
          </table>
          <p>Années :</p>
          <table>
            <tbody>
              <tr>
                <td><input id="A1" type="checkbox" name='1' onClick={this.handleCheckA1}/> <label>1e année</label></td>
                <td><input id="A2" type="checkbox" name='2' onClick={this.handleCheckA2}/> <label>2e année</label></td>
                <td><input id="A3" type="checkbox" name='3' onClick={this.handleCheckA3}/> <label>3e année</label></td>
              </tr>
              <tr>
                <td><input id="A4" type="checkbox" name='4' onClick={this.handleCheckA4}/> <label>4e année</label></td>
                <td><input id="A5" type="checkbox" name='5' onClick={this.handleCheckA5}/> <label>5e année</label></td>
                <td><input id="All" type="checkbox" name='toutes' onClick={this.handleCheckAll}/> <label>toutes</label></td>
              </tr>
            </tbody>
          </table>
          <p>Avec CV :</p>
          <table>
            <tbody>
              <tr><input id="frCV" type="checkbox" name='withFrCv' onClick={this.handleCheckFrCV}/>Avec CV français</tr>
              <tr><input id="enCV" type="checkbox" name='withFrCv' onClick={this.handleCheckEnCV}/>Avec CV anglais</tr>
            </tbody>
          </table>
          <input type="submit" value="Recherche" />
        </form>
      </div>
    );
  }
});

//---------------------------------------------------
var CVDownloadForm = React.createClass({
  render : function() {

    var value, id;
    if (this.props.language == 'fr') {
      value="fr";
      id="downloadFormFR";
    } else if (this.props.language == 'en') {
      value="en";
      id="downloadFormEN";
    }

    return (
      <form id={id} method="post" action="/file/download">
        <input type="hidden" name="dl" value={value}/>
        <input type="hidden" name="cvLogin" value={this.props.cvLogin}/>
        <input type="submit" value="Télécharger"/>
      </form>
    );
  }
});

//---------------------------------------------------

var CvList = React.createClass({
  render : function () {

    var cvListDisplay = this.props.cvList.map(function(cv) {
      var frCV, enCV, personalWebsite, linkedin, viadeo, github;

      if (cv.frCVPath == "")
        frCV = "-";
      else
        frCV = <CVDownloadForm language="fr" cvLogin={cv.login}/>;

      if (cv.enCVPath == "")
        enCV = "-";
      else
        enCV = <CVDownloadForm language="en" cvLogin={cv.login}/>;

      if (cv.personalWebsite == "")
        personalWebsite = "-";
      else {
        var httpPersonalWebsite = "http://" + cv.personalWebsite;
        personalWebsite = <a href={httpPersonalWebsite}>{cv.personalWebsite}</a>;
      }
      if (cv.linkedin == "")
        linkedin = "-";
      else
        linkedin = <a href={cv.linkedin} target="_blank">Linkedin</a>;

      if (cv.viadeo == "")
        viadeo = "-";
      else
        viadeo = <a href={cv.viadeo} target="_blank">Viadeo</a>;

      if (cv.github == "")
        github = "-";
      else
        github = <a href={cv.github} target="_blank">github</a>;
      return (
        <tr>
          <td>{cv.year}</td>
          <td>{cv.speciality}</td>
          <td>{cv.lastName}</td>
          <td>{cv.firstName}</td>
          <td>{frCV}</td>
          <td>{enCV}</td>
          <td>{personalWebsite}</td>
          <td>{linkedin}</td>
          <td>{viadeo}</td>
          <td>{github}</td>
        </tr>
      );
    });

    return (
      <div>
        <h2>Liste des CV</h2>
        <table>
          <tbody>
          <tr>
              <td>Année</td>
              <td>Spécialité</td>
              <td>Nom</td>
              <td>Prénom</td>
              <td>CV français</td>
              <td>CV anglais</td>
              <td>Site personnel</td>
              <td>Linkedin</td>
              <td>Viadeo</td>
              <td>Github</td>
            </tr>
            {cvListDisplay}
          </tbody>
        </table>
      </div>
    );
  }
});


//---------------------------------------------------

var CvBox = React.createClass({

  getInitialState : function() {
    return {cvList : [], cvListFound :[], specialities:[]}
  },

  componentDidMount: function() {
    $.ajax({
      url:'/Student/Students',
      dataType: 'json',
      cache: false,
      success : function(list) {
        this.setState({cvList: list, cvListFound:list});
      }.bind(this),
      error : function(xhr, status, err) {
        console.error('/Student/Students', status, err.toString());
      }.bind(this)
    });
  },

  search: function(specialitiesSearch,yearsSearch,All,frCV,enCV) {
    console.log("specialitiesSearch : " + specialitiesSearch);
    console.log("yearSearch : " + yearsSearch);
    var newList=[];
    this.state.cvList.forEach(function(person){
      console.log("Coucou1");
      var goodSpeciality = false;
      var goodYear = false;

      console.log("cvFr : " + frCV + " -" + person.frCVPath + "-, cvEn : " + enCV + " -" + person.enCVPath +"-");
      //Si cvfr demandé et person n'a pas de cvfr, alors person suivante
      if (frCV && person.frCVPath=="") {
        console.log("!!!!!!FR");
        return;
      }

      console.log("Coucou2");
      if (enCV && person.enCVPath=="") {
        console.log("!!!!!!EN");
        return;
      }

      console.log("Coucou3");
      //Is the person among the search specialities ?
      specialitiesSearch.some(function(speciality){
        console.log("Coucou4");
        if (speciality == person.speciality) {
          goodSpeciality = true;
          console.log("Coucou5");
          return true;//break the loop
        }
        return false;
      });
      console.log("Coucou6");

      if (!goodSpeciality) //On passe à la personne suivante
        return;
      console.log("Coucou7");
      if (!All) {
        console.log("Coucou8");
        //Is the person among the search years ?
        yearsSearch.some(function(year){
          console.log("Coucou9");
          if (year == person.year) {
            goodYear = true;
            console.log("Coucou10");
            return true; //break the loop
          }
          return false;
        });
      } else {
        goodYear = true;
      }

      console.log("goodSpeciality :" + goodSpeciality);
      console.log("goodYear :" + goodYear);
      if (goodYear) //Tout est respecté
        newList.push(person);
    });
    console.log("Avant setState : " + newList);
    this.setState({cvListFound: newList});
  },

  render : function () {
    return (
      <div className="CvBox">
        <h1>CVThèque</h1>
        <CriteriaBox  onSearch={this.search}/>
        <CvList cvList={this.state.cvListFound}/>
      </div>
    );
  }
});


ReactDOM.render(<CvBox />, document.getElementById('subBody'));
