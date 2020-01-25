module.exports = class Service2 extends Service
{
    static id = 'service2';

    constructor()
    {
        super();

        console.log( 'Service2 is running' );

        this.service('service1').on( 'foo-event', ( data ) =>
        {
            console.log( 'Service2 handled foo-event', data );
        });
    }

    sum( a, b )
    {
        console.log( 'Flow', LIQDJS_FLOW.scope() )

        return a + b;
    }
}

