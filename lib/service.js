'use strict';

const Err = require('./error');
const ServiceHandle = require('./service/handle.js');
//const ServiceBroker = require('./service/broker.js');

const { NOOP } = require('./helpers.js');
const { Server } = require('@liqd-js/websocket');
const Client_JSONRPC = require('@liqd-js/client-jsonrpc');

const Services = new Map();
const Brokers = new Set();
const Handlers = new Map();

ServiceHandle.init( Services, Brokers, Handlers );

function Emit( id, event, data )
{
    let service = Handlers.get( id );

    if( service)
    {
        let events = service.get( event );

        if( events )
        {
            for( let handler of events )
            {
                handler( ...data );
            }
        }
    }
}

module.exports = class Service
{
    #id;

    static init( brokers )
    {
        for( let broker of brokers )
        {
            broker = new Client_JSONRPC( broker );

            broker.on( 'call', async( call ) => 
            {
                if( call.method === 'service:call' )
                {
                    let service_call = call.params[0], service = Services.get( service_call.service );

                    if( service )
                    {
                        try
                        {
                            if( call.extensions.hasOwnProperty( '@liqd-js/flow' ))
                            {
                                const Flow = global.LIQDJS_FLOW || require('@liqd-js/flow');

                                Flow.start( async() =>
                                {
                                    for( let [ key, value ] of Object.entries( call.extensions['@liqd-js/flow'] ))
                                    {
                                        Flow.set( key, value.value, value.frozen );
                                    }

                                    broker.result( call.id, await service[service_call.method]( ...service_call.params ));
                                });
                            }
                            else
                            {
                                broker.result( call.id, await service[service_call.method]( ...service_call.params ));
                            }
                        }
                        catch( err )
                        {
                            err = Err( err );

                            broker.error( call.id, { code: err.code, message: err.message, data: err.data })
                        }
                    }
                    else{ broker.error( call.id, { code: 404, message: 'Service "' + serviceID + '" not found' })}
                }
                else if( call.method === 'service:discover' )
                {
                    broker.result( call.id, Services.has( call.params[0].service ));
                }
            });

            broker.on( 'event', async( event ) => 
            {
                if( event.name === 'service:event' )
                {
                    Emit( event.data[0].service, event.data[0].event, event.data[0].data );
                }
            });

            Brokers.add( broker );
        }
    }

    static get( id )
    {
        return ServiceHandle.create( null, id );
    }

    constructor( id )
    {
        this.#id = id || this.constructor.id;

        if( !this.#id )
        {
            throw new Error( 'Missing "id" in Service class "' + this.constructor.name + '"' );
        }

        Services.set( this.#id, this );
    }

    service( id )
    {
        return ServiceHandle.create( this.#id, id );
    }

    emit( event, ...data )
    {
        [...Brokers][0].event( 'service:event', { service: this.#id, event, data });

        Emit( this.#id, event, data );
    }
}