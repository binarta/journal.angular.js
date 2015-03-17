angular.module('journal', ['angular.usecase.adapter', 'rest.client', 'config', 'browser.info'])
    .factory('journaler', ['restServiceHandler', 'usecaseAdapterFactory', 'config', JournalerFactory])
    .run(['journaler', 'config', '$location', 'browserInfo', function(journaler, config, $location, browserInfo) {
        window.onerror = function(msg, url, lineNumber, column, obj) {
            journaler({from:'javascript.error.reporter', payload: {
                msg: msg,
                stack: obj ? obj.stack : msg,
                location: $location.absUrl(),
                namespace: config.namespace,
                browser: browserInfo.getInfo(),
                userAgent: window.navigator.userAgent
            }});
        }
    }]);

function JournalerFactory(restServiceHandler, usecaseAdapterFactory, config) {
    return function(args) {
        var ctx = usecaseAdapterFactory({});
        ctx.params = {
            method: 'PUT',
            url: config.baseUri + 'api/journal',
            data: {
                from: args.from,
                to: 'journalist',
                subject: 'journal',
                payload: args.payload
            },
            withCredentials: true
        };
        restServiceHandler(ctx);
    }
}