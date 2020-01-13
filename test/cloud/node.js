const fs = require('fs');

global.Service = require('../../lib/cloud').Service;

Service.init([ 'ws://localhost:8080' ]);

module.exports = class Node
{
    constructor( root )
    {
        console.log( 'Node "' + root + '" is running' );

        for( let service of fs.readdirSync( root ))
        {
            let instance;

            if( service === 'service1.js' )
            {
                setTimeout( async() =>
                {
                    console.log( await instance.sum( 1, 2 ));
                },
                1000 );
            }

            service = require( root + '/' + service );

            instance = new service();
        }
    }
}