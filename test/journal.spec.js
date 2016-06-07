var bowser = 'bowser-data';

describe('journal', function() {
    var rest, config, journaler;

    function request() {
        return rest.calls.first().args[0];
    }

    beforeEach(module('journal'));
    beforeEach(module('browser.info'));
    beforeEach(inject(function (restServiceHandler, _config_, _journaler_) {
        rest = restServiceHandler;
        config = _config_;
        journaler = _journaler_;

        config.baseUri = 'http://base-uri/';
        config.namespace = 'N';
    }));

    describe('journaler', function() {
        beforeEach(inject(function($location) {
            $location.path('/P');
        }));

        it('error was journaled', inject(function($location) {
            journaler({from: 'javascript.error.reporter', payload: {
                msg: 'M',
                stack: 'M'
            }});

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
    });
});