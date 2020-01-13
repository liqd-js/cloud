module.exports = class Service1 extends Service
{
    static id = 'service1';

    constructor()
    {
        super();

        console.log( 'Service1 is running' );
    }

    sum( a, b )
    {
        return this.service('service3').sum( a, b );
    }
}

