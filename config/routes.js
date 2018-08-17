/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
    
    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home pages.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/
    
    '/': {
        controller: 'HomeController',
        action: 'home'
    },
    
    '/admin': {
        controller: 'AdminController',
        action: 'home'
    },
    
    '/admin/login': {
        controller: 'AdminController',
        action: 'login'
    },
    
    '/Admin/YearSettings': {
        controller: 'AdminController',
        action: 'displayYearSettings'
    },
    
    '/Admin/SetPrices': {
        controller: 'AdminController',
        action: 'setPrices'
    },
    
    '/Admin/setInscriptionOpen': {
        controller: 'AdminController',
        action: 'setInscriptionOpen'
    },
    
    '/Admin/RegisteredCompanies': {
        controller: 'AdminController',
        action: 'displayCompanies'
    },
    
    '/Admin/ParticipatingStudents': {
        controller: 'AdminController',
        action: 'displayParticipatingStudents'
    },
    
    '/Admin/ParticipatingCompanies': {
        controller: 'AdminController',
        action: 'displayParticipatingCompanies'
    },
    
    '/Admin/SjdSessionInitialization': {
        controller: 'AdminController',
        action: 'initializeSjdSessions'
    },
    
    '/Admin/SjdSessions': {
        controller: 'AdminController',
        action: 'displaySjdSessions'
    },
    
    '/Admin/SjdParticipants': {
        controller: 'AdminController',
        action: 'displaySjdParticipants'
    },
    
    '/Admin/addCompaniesToSjd': {
        controller: 'AdminController',
        action: 'addCompaniesToSjd'
    },
    
    '/Admin/CheckList': {
        controller: 'AdminController',
        action: 'checkTasks'
    },
    
    '/Admin/changeStudentSjd': {
        controller: 'AdminController',
        action: 'changeStudentSjd'
    },
    
    /*-------------  new admin ------------------*/
    '/admin/settings' : {
        controller: 'Admin/SettingsController',
        action: 'display'
    },
    
    'POST /admin/settings/yearsettings' : {
        controller: 'Admin/SettingsController',
        action: 'updateYearSettings'
    },
    
    'POST /admin/settings/generalsettings' : {
        controller: 'Admin/SettingsController',
        action: 'updateGeneralSettings'
    },
    
    '/admin/students': {
        controller: 'Admin/StudentController',
        action: 'listing'
    },
    
    '/admin/student/:id': {
        controller: 'Admin/StudentController',
        action: 'update'
    },
    
    '/admin/companies': {
        controller: 'Admin/CompanyController',
        action: 'listing'
    },
    
    '/admin/company/create': {
        controller: 'Admin/CompanyController',
        action: 'create'
    },
    
    '/admin/company/:siret': {
        controller: 'Admin/CompanyController',
        action: 'update'
    },
    
    
    '/admin/sells': {
        controller: 'AdminController',
        action: 'getSells'
    },
    
    '/admin/sell/:id': {
        controller: 'AdminController',
        action: 'updateSell'
    },
    
    '/admin/sjds': {
        controller: 'AdminController',
        action: 'getSjds'
    },
    
    '/admin/specialities': {
        controller: 'Admin/SpecialityController',
        action: 'listing'
    },
    
    '/admin/speciality/:abbreviation': {
        controller: 'Admin/SpecialityController',
        action: 'update'
    },
    
    '/admin/specility/create': {
        controller: 'Admin/SpecialityController',
        action: 'create'
    },
    
    '/admin/offers': {
        controller: 'Admin/OfferController',
        action: 'listing'
    },
    
    '/admin/offer/create': {
        controller: 'Admin/OfferController',
        action: 'create'
    },
    
    '/admin/offer/:id': {
        controller: 'Admin/OfferController',
        action: 'update'
    },
    
    '/admin/companystatus': {
        controller: 'Admin/CompanyStatusController',
        action: 'listing'
    },
    
    '/admin/companystatus/create': {
        controller: 'Admin/CompanyStatusController',
        action: 'create'
    },
    
    '/admin/companystatus/generate': {
        controller: 'Admin/CompanyStatusController',
        action: 'generate'
    },
    
    '/admin/vigipirate/student': {
        controller: 'Admin/VigipirateController',
        action: 'listingParticipatingStudent'
    },
    
    '/admin/vigipirate/company': {
        controller: 'Admin/VigipirateController',
        action: 'listingParticipatingCompany'
    },
    
    /*-----------  End new admin ----------------*/
    
    /*-------------  Admin api ------------------*/
    '/admin/api/student': {
        controller: 'Admin/StudentController',
        action: 'apiGetAll'
    },
    
    '/admin/api/company': {
        controller: 'Admin/CompanyController',
        action: 'apiGetAll'
    },
    
    'POST /admin/api/company/update': {
        controller: 'Admin/CompanyController',
        action: 'apiUpdate'
    },
    
    '/admin/api/sells': {
        controller: 'AdminController',
        action: 'apiGetAllSells'
    },
    
    'POST /admin/api/sells/update': {
        controller: 'AdminController',
        action: 'apiUpdateSells'
    },
    
    '/admin/api/sjd': {
        controller: 'AdminController',
        action: 'apiGetAllSjds'
    },
    
    '/admin/api/speciality': {
        controller: 'Admin/SpecialityController',
        action: 'apiGetAll'
    },
    
    'POST /admin/api/speciality/delete': {
        controller: 'Admin/SpecialityController',
        action: 'apiDelete'
    },
    
    '/admin/api/offers': {
        controller: 'Admin/OfferController',
        action: 'apiGetAll'
    },
    
    'POST /admin/api/offer/update': {
        controller: 'Admin/OfferController',
        action: 'apiUpdate'
    },
    
    'POST /admin/api/offer/delete': {
        controller: 'Admin/OfferController',
        action: 'apiDelete'
    },
    
    '/admin/api/companystatus': {
        controller: 'Admin/CompanyStatusController',
        action: 'apiGetAll'
    },
    
    'POST /admin/api/companystatus/delete': {
        controller: 'Admin/CompanyStatusController',
        action: 'apiDelete'
    },
    
    '/admin/api/vigipirate/students': {
        controller: 'Admin/VigipirateController',
        action: 'apiGetAllParticipatingStudents'
    },
    
    '/admin/api/vigipirate/companies': {
        controller: 'Admin/VigipirateController',
        action: 'apiGetAllParticipatingCompanies'
    },
    
    /*-----------  End Admin api ----------------*/
    
    '/Track': {
        view: 'Track/Homepage',
        locals: {layout: 'layout', title: 'Suivi - FIE'}
    },
    
    '/Track/Login': {
        controller: 'TrackController',
        action: 'trackLogin'
    },
    
    '/Track/YearSettings': {
        controller: 'TrackController',
        action: 'displayYearSettings'
    },
    
    '/Track/RegisteredCompanies': {
        controller: 'TrackController',
        action: 'displayCompanies'
    },
    
    '/Track/CompanyInfo': {
        controller: 'TrackController',
        action: 'displayACompany'
    },
    
    '/Track/Sells': {
        controller: 'TrackController',
        action: 'displaySells'
    },
    
    
    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/
    
    '/INSA': {
        view: 'Insa/InsaDescription',
        locals: {layout: 'layout', title: 'INSA - FIE'}
    },
    
    '/Forum': {
        view: 'Forum/forumDescription',
        locals: {layout: 'layout', title: 'Forum - FIE'}
    },
    
    '/SJD': {
        view: 'SpeedJobDating/SJDDescription',
        locals: {layout: 'layout', title: 'Speed Job Dating - FIE'}
    },
    
    '/Conferences': {
        view: 'Conferences/confDescription',
        locals: {layout: 'layout', title: 'Conférences - FIE'}
    },
    
    '/Ateliers': {
        view: 'Ateliers/ateliersDescription',
        locals: {layout: 'layout', title: 'Ateliers - FIE'}
    },
    
    '/about': {
        view: 'About/Contact',
        locals: {layout: 'layout', title: 'A Propos - FIE'}
    },
    
    '/file/uploadCV': {
        controller: 'FileController',
        action: 'uploadCV'
    },
    
    '/file/uploadLogo': {
        controller: 'FileController',
        action: 'uploadLogo'
    },
    
    '/file/download': {
        controller: 'FileController',
        action: 'download'
    },
    
    '/file/bills/download': {
        controller: 'FileController',
        action: 'downloadBill'
    },
    
    /*
	 ===========================================================================================================
	 ============================================== STUDENT'S VIEWS=============================================
	 ===========================================================================================================
	 */
    
    '/Student/StudentSpace': {
        view: 'StudentSpace/StudentSpace',
        locals: {layout: 'layout', title: 'Espace Perso - FIE'}
    },
    
    '/Student/testphp': {
        controller: 'StudentController',
        action: 'testPhp'
    },
    
    '/Student/Specialities': {
        controller: 'StudentController',
        action: 'getSpecialities'
    },
    
    '/Student/Students': {
        controller: 'StudentController',
        action: 'getStudents'
    },
    
    /*
	 ===========================================================================================================
	 ============================================== STUDENT'S CONTROLLERS=======================================
	 ===========================================================================================================
	 */
    
    
    '/Student/Login': {
        controller: 'StudentController',
        action: 'login'
    },
    
    '/Student/StudentLogout': {
        controller: 'StudentController',
        action: 'StudentLogout'
    },
    
    '/Student/Profile': {
        controller: 'StudentController',
        action: 'profile'
    },
    
    // Modification profile
    
    '/Student/setAUserInfo': {
        controller: 'StudentController',
        action: 'setAUserInfo'
    },
    
    '/Student/setAllInfo': {
        controller: 'StudentController',
        action: 'setAllInfo'
    },
    
    '/Student/Companies': {
        controller: 'StudentController',
        action: 'companies'
    },
    
    '/Student/SJD': {
        controller: 'StudentController',
        action: 'sjd'
    },
    
    '/Student/CompanyInfo': {
        controller: 'StudentController',
        action: 'displayACompany'
    },
    
    '/Student/SjdInscription': {
        controller: 'StudentController',
        action: 'sjdInscription'
    },
    
    /*
	 ===========================================================================================================
	 ============================================== COMPANY'S VIEWS ============================================
	 ===========================================================================================================
	 */
    
    '/Company/ResetPassPage': {
        view: 'Connection_Password/ResetPassPage',
        locals: {layout: 'layout', title: 'Reinitialisation - FIE'}
    },
    
    /*
	 ===========================================================================================================
	 ======================================== ROUTES TO COMPANY'S CONTROLLERS ==================================
	 ===========================================================================================================
	 */
    
    '/Company/new': {
        controller: 'CompanyController',
        action: 'new'
    },
    
    '/Company/create': {
        controller: 'CompanyController',
        action: 'create'
    },
    
    '/Company/AuthCompany': {
        controller: 'CompanyController',
        action: 'AuthentificateCompany'
    },
    
    '/Company/CompanyLogout': {
        controller: 'CompanyController',
        action: 'CompanyLogout'
    },
    
    '/Company/ActivateCompany': {
        controller: 'CompanyController',
        action: 'ActivateCompany'
    },
    
    '/Company/ResetPass': {
        controller: 'CompanyController',
        action: 'InitPasswdCompany'
    },
    
    '/Company/Profile': {
        controller: 'CompanyController',
        action: 'Profile'
    },
    
    '/Company/CvTheque': {
        controller: 'CompanyController',
        action: 'CvTheque'
    },
    
    '/Company/Command': {
        controller: 'CompanyController',
        action: 'Command'
    },
    
    '/Company/update': {
        controller: 'CompanyController',
        action: 'update'
    },
    
    /* COMMANDES */
    '/Command/NewCommand': {
        controller: 'SellsController',
        action: 'addASell'
    },
    
    '/Company/Bills': {
        controller: 'CompanyController',
        action: 'displayBills'
    },
    
    '/Admin/setInscriptionDeadline': {
        controller: 'AdminController',
        action: 'setInscriptionDeadline'
    },
    
    '/Company/ChangePassword': {
        controller: 'CompanyController',
        action: 'changePassword'
    },
    
    '/Company/VigipirateRegistration': {
        controller: 'CompanyController',
        action: 'addVigipirate'
    },
    
    '/Company/Vigipirate': {
        controller: 'CompanyController',
        action: 'displayVigipirate'
    },
    
    '/Company': {
        controller: 'CompanyController',
        action: 'TODOlist'
    },
    
    /*
	 ===========================================================================================================
	 ======================================== PARTICIPATING STUDENTS ==================================
	 ===========================================================================================================
	 */
    
    '/Participation/Login': {
        controller: 'ParticipatingStudentController',
        action: 'login'
    },
    
    '/Participation': {
        view: 'StudentParticipation/Participation',
        locals: {layout: 'layout'}
    },
    
    /*
	 ===========================================================================================================
	 ======================================== SJD ==================================
	 ===========================================================================================================
	 */
    
    '/Company/AddSpecialities': {
        controller: 'SjdController',
        action: 'AddSpecialities'
    },
    
    '/Company/ManageSjd': {
        controller: 'SjdController',
        action: 'showSjdCompanyInscription'
    }
    
    /*
	 '/Admin/InitializeSjd': {
	 controller: 'SjdController',
	 action: 'initialize'
	 } */
};
