/**
 * Created by coreyching on 2/26/16.
 */

(function(app) {
    app.AppComponent =
        ng.core.Component({
                selector: 'my-app',
                template: '<div id="mapid"></div>'
            })
            .Class({
                constructor: function() {}


            });

})(window.app || (window.app = {}));