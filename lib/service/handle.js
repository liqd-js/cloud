'use strict';

//const ServiceCall = require('./call.js');

const TimedPromise = require('@liqd-js/timed-promise');

let Services = new Map();
let Brokers = new Set();
let Handlers = new Map();

function on( id, event, handler )
{
    let service = Handlers.get( id );

    if( !service){ Handlers.set( id, service = new Map())}

    let events = service.get( event );

    if( !events){ service.set( event, events = new Set())}

    events.add( handler );
}

function off( id, event, handler )
{
    let service = Handlers.get( id );

    if( service)
    {
        let events = service.get( event );

        if( events )
        {
            events.delete( handler );
        }
    }
}

function ServiceCall( context, caller, id, method, ...params )
{
    if( method === 'on' )
    {
        return on( id, params[0], params[1] );
    }
    if( method === 'off' )
    {
        return off( id, params[0], params[1] );
    }

    const start = process.hrtime(); let end;

    return new TimedPromise( async( resolve, reject ) =>
    {
        let service = Services.get( id );

        if( service )
        {
            try
            {
                let result = await service[method]( ...params ); 
                
                end = process.hrtime( start );

                resolve( result );
            }
            catch( err )
            {
                end = process.hrtime( start );

                reject( err );
            }
        }
        else
        {
            try
            {
                let flow = global.LIQDJS_FLOW ? global.LIQDJS_FLOW.scope() : undefined;
            
                let result = await [...Brokers][0].call( 'service:call', { service: id, method, params }, flow ? { '@liqd-js/flow': flow } : undefined );

                end = process.hrtime( start );

                resolve( result.result );
            }
            catch( err )
            {
                end = process.hrtime( start );

                reject({ code: err.code, message: err.message, data: err.data });
            }
        }

        //console.log({ caller, service: id, method, params, took: (( end[0] * 1e9 + end[1] ) / 1e6 ).toFixed(3) + 'ms' });
    });
}

const ServiceHandle = module.exports = class ServiceHandle
{
    #caller; #id;

    static init( services, brokers, handlers )
    {
        Services = services;
        Brokers = brokers;
        Handlers = handlers;
    }

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