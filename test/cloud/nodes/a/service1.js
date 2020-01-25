module.exports = class Service1 extends Service
{
    static id = 'service1';

    constructor()
    {
        super();

        console.log( 'Service1 is running' );

        setTimeout(() => 
        {
            this.emit( 'foo-event', 'foo', 'bar' );
        },
        2000 );

        this.service('service1').on( 'foo-event', ( data ) =>
        {
            console.log( 'Service1 handled foo-event', data );
        });
    }

    sum( a, b )
    {
        return this.service('service3').sum( a, b );
    }
}

