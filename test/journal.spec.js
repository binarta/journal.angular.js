var bowser = 'bowser-data';

describe('journal', function() {
    var rest, config;

    function request() {
        return rest.calls[0].args[0];
    }

    beforeEach(module('journal'));
    beforeEach(inject(function (restServiceHandler, _config_) {
        rest = restServiceHandler;
        config = _config_;

        config.baseUri = 'http://base-uri/';
        config.namespace = 'N';
    }));

    describe('on module run', function() {
        beforeEach(inject(function($location) {
            $location.path('/P');
        }));

        it('error was journaled', inject(function($location) {
            window.onerror('M', 'U', 1);

            expect(request().params).toEqual({
                method:'PUT',
                url: config.baseUri + 'api/journal',
                data: {
                    from: 'javascript.error.reporter',
                    to: 'journalist',
                    subject: 'journal',
                    payload: {
                        msg: 'M',
                        stack: 'M',
                        location: $location.absUrl(),
                        namespace: config.namespace,
                        browser: bowser,
                        userAgent: window.navigator.userAgent
                    }
                },
                withCredentials:true
            })
        }));

        it('when logging error with stacktrace also journal it', inject(function() {
            window.onerror('M', 'U', 1, 1, {stack:'S'});

            expect(request().params.data.payload.stack).toEqual('S');
        }))
    });
});