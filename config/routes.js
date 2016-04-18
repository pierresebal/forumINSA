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
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'Homepage/Homepage',
    locals:{layout:'layout'}
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

  '/Connection':{
    view:'Connection_Password/Connection',
    locals:{layout:'layout'}
  },

  '/INSA':{
    view:'Insa/InsaDescription',
    locals:{layout:'layout'}
  },

  '/Forum':{
    view:'Forum/forumDescription',
    locals:{layout:'layout'}
  },

  '/SJD':{
    view:'SpeedJobDating/SJDDescription',
    locals:{layout:'layout'}
  },

  '/about':{
    view:'About/tmp',
    locals:{layout:'layout'}
  },

  '/file/uploadCV':{
    controller: 'FileController',
    action: 'uploadCV'
  },

  '/file/uploadLogo':{
    controller: 'FileController',
    action: 'uploadLogo'
  },

  '/file/download':{
    controller: 'FileController',
    action: 'download'
  },



  /*
   ===========================================================================================================
   ============================================== STUDENT'S VIEWS=============================================
   ===========================================================================================================
   */

  '/Student/StudentSpace':{
    view:'StudentSpace/StudentSpace',
    locals:{layout:'layout'}
  },

  '/Student/Specialities':{
    controller: 'StudentController',
    action: 'getSpecialities'
  },

  '/Student/Students':{
    controller: 'StudentController',
    action : 'getStudents'
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

  '/Student/StudentLogout':{
    controller:'StudentController',
    action:'StudentLogout'
  },

  '/Student/Profile':{
    controller: 'StudentController',
    action: 'profile'
  },

  // Modification profile

  '/Student/setAUserInfo':{
    controller: 'StudentController',
    action: 'setAUserInfo'
  },

  '/Student/setAllInfo':{
    controller: 'StudentController',
    action: 'setAllInfo'
  },

  '/Student/Companies':{
    controller: 'StudentController',
    action: 'companies'
  },

  '/Student/SJD':{
    controller: 'StudentController',
    action: 'sjd'
  },




  /*
   ===========================================================================================================
   ============================================== COMPANY'S VIEWS ============================================
   ===========================================================================================================
   */

  '/Company/Inscription':{
    view:'Inscription/Inscription',
    locals:{layout:'layout'}
  },


  '/Company/ResetPassPage':{
    view:'Connection_Password/ResetPassPage',
    locals:{layout:'layout'}
  },

  '/Company/CompanySpace':{
    view:'CompanySpace/CompanySpace',
    locals:{layout:'layout'}
  },

  /*
   ===========================================================================================================
   ======================================== ROUTES TO COMPANY'S CONTROLLERS ==================================
   ===========================================================================================================
   */

  '/Company/CreateCompany':{
    controller:'CompanyController',
    action:'CreateCompany'
  },

  '/Company/AuthCompany':{
    controller:'CompanyController',
    action:'AuthentificateCompany'
  },

  '/Company/MemberSpace':{
    controller:'CompanyController',
    action:"MemberHomeShow"
  },

  '/Company/CompanyLogout':{
    controller:'CompanyController',
    action:'CompanyLogout'
  },

  '/Company/ActivateCompany':{
    controller:'CompanyController',
    action:'ActivateCompany'
  },

  '/Company/ResetPass':{
    controller:'CompanyController',
    action:'InitPasswdCompany'
  },

  '/Company/Profile':{
    controller:'CompanyController',
    action:'Profile'
  },

  '/Company/CvTheque':{
    controller:'CompanyController',
    action:'CvTheque'
  },

  '/Company/Command':{
    controller:'CompanyController',
    action:'Command'
  },

  '/Company/setAUserInfo':{
    controller:'CompanyController',
    action:'setAUserInfo'
  }

};
