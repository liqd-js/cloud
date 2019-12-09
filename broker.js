'use strict';

// modify by extending the broker

module.exports = class Broker
{
    #server = new Server();

    constructor( port )
    {
        this.#server.ws(( client, req ) =>
        {
            console.log( 'Client', client );
        });
        
        this.#server.listen( port );
    }
}