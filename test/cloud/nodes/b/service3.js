const Flow = require('@liqd-js/flow');

module.exports = class Service3 extends Service
{
    static id = 'service3';

    constructor()
    {
        super();

        console.log( 'Service3 is running' );
    }

    sum( a, b )
    {
        return new Promise( async( resolve, reject ) =>
        {
            Flow.start( async () =>
            {
                resolve( await this.service('service2').sum( a, b ));
            },
            { foo: 'bar' });
        });
    }
}

