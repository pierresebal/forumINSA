// Service which contain a function able to send a mail
let pdf = require('html-pdf');
let ejs = require('ejs');

module.exports ={

    /**
     * Generate Pdf file from ejs template
     * @param {String} templatePath     Path lead to template .ejs (root in view)
     * @param {Object} templateData     Data that fills in template
     * @param {String} destinationPath  Destination path for pdf file
     * @param {Object} ejsOptions       @see ejs doc
     * @param {Object} pdfOptions       @see html-pdf doc
     * @callback       callback         function(err, {fileName: string})
     */
    createFromEjs: (templatePath, templateData, destinationPath, ejsOptions, pdfOptions, callback) =>    {

        if(typeof ejsOptions === 'function')    {
            callback = ejsOptions;
            ejsOptions = {};
        }

        if(typeof pdfOptions === 'function')    {
            callback = pdfOptions;
            pdfOptions = {};
        }

        // ajust templatePath:
        templatePath = 'views/' + templatePath + '.ejs';

        ejs.renderFile(templatePath, templateData, ejsOptions, (err, html) => {
            if(err) {
                sails.log.error('[PdfService.createFromEjs] error when render from ejs template', err);
                return callback(err);
            }

            pdf.create(html, pdfOptions).toFile(destinationPath, (err, pdf) => {
                if(err) {
                    sails.log.error('[PdfService.createFromEjs] error when render from ejs template', err);
                    return callback(err);
                }

                return callback(false, pdf);
            });
        });
    }

};
