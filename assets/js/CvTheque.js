var CriteriaBox =  React.createClass({

  getInitialState: function() {
    //return {specialities: []};
    return {AE:false, GB:false, GPE:false, GMM:false, GM:false, GP:false, IR:false, AS:false, A1:false, A2:false, A3:false, A4:false, A5:false, All:false, frCV:false, enCV:false}
  },

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
      specialitiesSearch.push('Génie Mathématique Appliqué');
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

    return( //Todo : A automatiser
      <div className="CriteriaBox">
        <h2>Critères</h2>
        <form onSubmit={this.onSearchSubmit}>
        <br/>
          <p>Spécialités :</p>
          <table id="table_react" style={{borderSpacing: '10px', borderCollapse: 'separate'}}>
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
          <br/>
          <p>Années :</p>
          <table style={{borderSpacing: '10px', borderCollapse: 'separate'}}>
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
          <br/>
          <p>Avec CV :</p>
          <table style={{borderSpacing: '10px', borderCollapse: 'separate'}}>
            <tbody>
              <tr><input id="frCV" type="checkbox" name='withFrCv' onClick={this.handleCheckFrCV}/>français</tr><br/>
              <tr><input id="enCV" type="checkbox" name='withFrCv' onClick={this.handleCheckEnCV}/>anglais</tr>
            </tbody>
          </table>
          <br/>
          <button id="btn_react" type="submit" class="form-button">Rechercher</button>
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
      <form class="pure-form" id={id} method="post" action="/file/download">
        <input type="hidden" name="dl" value={value}/>
        <input type="hidden" name="cvLogin" value={this.props.cvLogin}/>
        <input type="submit" class="form-button" value="Télécharger"/>
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
        personalWebsite = <a href={cv.personalWebsite} target="_blank">Site personnel</a>;
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
        <table class="pure-form" style={{borderSpacing: '10px', borderCollapse: 'separate'}}>
          <tbody>
          <tr className='unselectable'>
              <th onClick={this.props.onSortByYear}>Année</th>
              <th onClick={this.props.onSortBySpeciality}>Spécialité</th>
              <th onClick={this.props.onSortByLastName}>Nom</th>
              <th onClick={this.props.onSortByFirstName}>Prénom</th>
              <th>CV français</th>
              <th>CV anglais</th>
              <th>Site personnel</th>
              <th>Linkedin</th>
              <th>Viadeo</th>
              <th>Github</th>
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
    return {cvList : [], cvListFound :[], yearDown:true, specialityDown:true, lastNameDown:true, firstNameDown:true}
  },

  componentDidMount: function() {
    $.ajax({
      url:'/Student/Students',
      dataType: 'json',
      cache: false,
      success : function(list) {
        this.setState({cvList: list});
      }.bind(this),
      error : function(xhr, status, err) {
        console.error('/Student/Students', status, err.toString());
      }.bind(this)
    });
  },

  sortByLastName:function() {
    var newList = this.state.cvListFound;
    if (this.state.lastNameDown)
      newList.sort(function (a, b) {return a.lastName.localeCompare(b.lastName);});
    else
      newList.sort(function (a, b) {return b.lastName.localeCompare(a.lastName);});

    this.setState({cvListFound:newList, lastNameDown:!this.state.lastNameDown});
  },

  sortByFirstName:function() {
    var newList = this.state.cvListFound;
    if (this.state.firstNameDown)
      newList.sort(function (a, b) {return a.firstName.localeCompare(b.firstName);});
    else
      newList.sort(function (a, b) {return b.firstName.localeCompare(a.firstName);});

    this.setState({cvListFound:newList, firstNameDown:!this.state.firstNameDown});
  },

  sortByYear:function() {
    var newList = this.state.cvListFound;
    if (this.state.yearDown)
      newList.sort(function (a, b) {return a -b;});
    else
      newList.sort(function (a, b) {return b -a;});

    this.setState({cvListFound:newList, yearDown:!this.state.yearDown});
  },

  sortBySpeciality:function() {
    var newList = this.state.cvListFound;
    if (this.state.specialityDown)
      newList.sort(function (a, b) {return a.speciality.localeCompare(b.speciality);});
    else
      newList.sort(function (a, b) {return b.speciality.localeCompare(a.speciality);});

    this.setState({cvListFound:newList, specialityDown:!this.state.specialityDown});
  },

  search: function(specialitiesSearch,yearsSearch,All,frCV,enCV) {
    var newList=[];
    this.state.cvList.forEach(function(person){
      var goodSpeciality = false, goodYear = false;

      //Si cvfr demandé et person n'a pas de cvfr, alors person suivante
      if (frCV && person.frCVPath=="")
        return;

      if (enCV && person.enCVPath=="")
        return;

      //Is the person among the search specialities ?
      specialitiesSearch.some(function(speciality){
        if (speciality == person.speciality) {
          goodSpeciality = true;
          return true;//break the loop
        }
        return false;
      });

      if (!goodSpeciality) //On passe à la personne suivante
        return;
      if (!All) {
        //Is the person among the search years ?
        yearsSearch.some(function(year){
          if (year == person.year) {
            goodYear = true;
            return true; //break the loop
          }
          return false;
        });
      } else
        goodYear = true;

      if (goodYear) //Tout est respecté
        newList.push(person);
    });
    this.setState({cvListFound: newList});
  },

  render : function () {
    return (
      <div className="CvBox">
        <h1>CVThèque</h1>
        <p>La CVThèque se remplit au fur et à mesure que les étudiants upload leur CV.</p>
        <CriteriaBox  onSearch={this.search}/>
        <CvList
          cvList={this.state.cvListFound}
          onSortByLastName={this.sortByLastName}
          onSortByFirstName={this.sortByFirstName}
          onSortByYear={this.sortByYear}
          onSortBySpeciality={this.sortBySpeciality}
        />
      </div>
    );
  }
});


ReactDOM.render(<CvBox />, document.getElementById('subBody'));
