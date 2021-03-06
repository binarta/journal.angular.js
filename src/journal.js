angular.module('journal', ['angular.usecase.adapter', 'rest.client', 'config', 'browser.info'])
    .factory('journaler', ['restServiceHandler', 'usecaseAdapterFactory', 'config', 'browserInfo', '$location', JournalerFactory]);

function JournalerFactory(restServiceHandler, usecaseAdapterFactory, config, browserInfo, $location) {
    return function(args) {
        args.payload.namespace = config.namespace;
        args.payload.location = $location.absUrl();
        args.payload.browser = browserInfo.getInfo();
        args.payload.userAgent = window.navigator.userAgent;
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