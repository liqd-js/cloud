'use strict';

// modify by extending the broker

const { NOOP } = require('./helpers.js');
const { Server } = require('@liqd-js/websocket');
const Client_JSONRPC = require('@liqd-js/client-jsonrpc');

module.exports = class Broker
{
    #server; 
    #nodes = new Set(); 
    #services = new Map();

    constructor( port )
    {
        this.#server = new Server({ port });
        
        this.#server.on( 'client', ( client, req ) =>
        {
            let node = new Client_JSONRPC( client );

            node.on( 'call', async( call ) => 
            {
                if( call.method === 'service:call' )
                {
                    let service_call = call.params[0], service_node = this.#services.get( service_call.service );

                    try
                    {
                        if( !service_node )
                        {
                            service_node = await this._discover( service_call.service, node );
                        }

                        node.result( call.id, ( await service_node.call( 'service:call', call.params, call.extensions )).result );
                    }
                    catch( err ){ node.error( call.id, { code: err.code, message: err.message, data: err.data })}
                }
            });

            this.#nodes.add( node );
        
            client.on( 'close', () => this.#nodes.delete( node ));
            client.on( 'error', NOOP );
        });
    }

    _discover( service, caller )
    {
        return new Promise(( resolve, reject ) =>
        {
            for( let node of this.#nodes )
            {
                if( node === caller ){ continue }

                node.call( 'service:discover', { service }).then( has => has.result ? resolve( node ) : NOOP ).catch( NOOP );
            }
        });
    }
}