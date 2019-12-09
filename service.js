'use strict';

function ServiceCall( context, caller, id, method, ...params )
{
    const start = process.hrtime();

    return new Promise(( resolve, reject ) =>
    {
        const end = process.hrtime( start );

        console.log({ caller, service: id, method, params, took: (( end[0] * 1e9 + end[1] ) / 1e6 ).toFixed(3) + 'ms' });
    });
}

class ServiceHandle
{
    #caller; #id;

    constructor( caller, id )
    {
        this.#caller = caller;
        this.#id = id;
    }

    static create( caller, id )
    {
        return new Proxy( new ServiceHandle( caller, id ),
        {
            get : function( handle, property )
            {
                return ServiceCall.bind( handle, {}, handle.#caller, handle.#id, property );
            }
        });
    }
}

module.exports = class Service
{
    #id;

    constructor( id )
    {
        this.#id = id || this.constructor.id;

        if( !this.#id )
        {
            throw new Error( 'Missing "id" in Service class "' + this.constructor.name + '"' );
        }
    }

    service( id )
    {
        return ServiceHandle.create( this.#id, id );
    }
}