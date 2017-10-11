/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    // Control for member access
    CompanyController: {
        MemberHomeShow: "CompanyAuth",
        update: 'CompanyAuth',
        Profile: "CompanyAuth",
        CvTheque: "CompanyAuth",
        Command: "CompanyAuth",
        CompanyLogout: "CompanyAuth",
        displayBills: "CompanyAuth",
        changePassword: "CompanyAuth",
        TODOlist: "CompanyAuth",
        displayVigipirate: "CompanyAuth",
        addVigipirate: "CompanyAuth"
    },

    StudentController: {
        StudentLogout: "StudentAuth",
        profile: "StudentAuth",
        setAUserInfo: "StudentAuth",
        setAllInfo: "StudentAuth",
        Companies: "StudentAuth",
        sjd: "StudentAuth",
        displayACompany: "StudentAuth"
    },

    SellsController: {
        addASell: "CompanyAuth"
    },

    SjdController: {
        addSpecialities: "CompanyAuth",
        showSjdCompanyInscription: "CompanyAuth"
    },


    //------------------- protect admin -----------------------//
    AdminController: {
        '*': 'adminAuth',
        'login': true
    },

    'Admin/VigipirateController': {
        '*': 'adminAuth'
    },

    'Admin/StudentController': {
        '*': 'adminAuth'
    },

    'Admin/CompanyController': {
        '*': 'adminAuth'
    }

};
