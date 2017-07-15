/**
 * Datatable Service will ensure the coherence column between the back side and the view
 * @author: Kihansi
 */

//TODO failed, find the way to be able to create a generator

//create generator
function Generator(attributes) {
    this.columns = _.clone(attributes);
    this.dtProjection = () =>  {
        return {select: Object.keys(this.columns)};
    };

    this.dtHeaderHtml = () =>  {
        let attributeHeader = '';
        for(let columnHtml of Object.values(this.columns))  {
            attributeHeader += '<th>' + columnHtml + '</th>';
        }
        return '<thead><tr>' + attributeHeader + '</tr> </thead>';
    };

    this.dtColumnsJs = () => {
        let js = '[';
        for(let column of Object.keys(this.columns))    {
            js += '{ "data" : "' + column +'" },';
        }
        return js.replace(/.$/, ']');   //replace the last ',' by ]
    };
}

module.exports = {

    /**
     * How to use:
     * -- In controller:
     * DatatablesService.generateDatatable({
     *      'column1': 'My column 1',
     *      'column2': 'My column 2',
     * }, (dtgenerator) => {
     *      if(!dtgenerator)  {
     *          // error some where
     *          return;
     *      }
     *
     *      MyModel.find({'field':'value'}, generator.dtProjection()).exec((err, records) =>    {
     *          //...
     *
     *          return res.view('...', {
     *              ...,
     *              dtgenerator: dtgenerator
     *          });
     *      })
     * }
     *
     * -- In view:
     * <html>
     *     ....
     *      <table id='datatable ...>
     *      <theader><%= datagenerator.dtHeaderHtml() %></theader>
     *      </table>
     *      ...
     *  <script>
     *      $('#datatable').Datatables({
     *          ajax: {
     *              ...
     *          },
     *          columns: <%= datagenerator.dtColumnsJs() %>
     *       });
     *  </script>
     *  </html>
     */

    /**
     * Generate an object that will generate the html and the queries from an array of string
     * @param attributes: Object {'attribute': 'Name in html'}
     * @param callback: function(datatable)
     * @returns Object datatables
     */
    getGenerator: function(attributes, callback)  {

        // asset
        if(!attributes || _.isEmpty(attributes))    {
            sails.log.error('[DatatablesService.generateDatatable] attribute is not defined, given parameter: ');
            sails.log.error(attributes);
            return callback(false);
        }

        return Generator(attributes);
    }

};
