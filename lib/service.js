'use strict';

const ServiceHandle = require('./service/handle.js');
//const ServiceBroker = require('./service/broker.js');

const { NOOP } = require('./helpers.js');
const { Server } = require('@liqd-js/websocket');
const Client_JSONRPC = require('@liqd-js/client-jsonrpc');

const Services = new Map();
const Brokers = new Set();

ServiceHandle.init( Services, Brokers );

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
                        catch( err ){ broker.error( call.id, { code: err.code, message: err.message, data: err.data })}
                    }
                    else{ broker.error( call.id, { code: 404, message: 'Service "' + serviceID + '" not found' })}
                }
                else if( call.method === 'service:discover' )
                {
                    broker.result( call.id, Services.has( call.params[0].service ));
                }
            });

            Brokers.add( broker );
        }
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
}