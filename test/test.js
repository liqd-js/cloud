const fs = require('fs');
const cluster = require('cluster');

if( cluster.isMaster )
{
    require('./cloud/broker');
    
    for( let node of fs.readdirSync( __dirname + '/cloud/nodes' ))
    {
        let worker = cluster.fork();

        worker.on( 'online', () =>
        {
            worker.send( node );
        });
    }
}
else
{
    const Node = require('./cloud/node');

    process.on( 'message', node => 
    {
        node = new Node( __dirname + '/cloud/nodes/' + node );
    });
}