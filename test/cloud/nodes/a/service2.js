module.exports = class Service2 extends Service
{
    static id = 'service2';

    constructor()
    {
        super();

        console.log( 'Service2 is running' );
    }

    sum( a, b )
    {
        console.log( 'Flow', LIQDJS_FLOW.scope() )

        return a + b;
    }
}

