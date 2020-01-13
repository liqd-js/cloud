const { Broker } = require('../../lib/cloud');

const instance = new Broker( 8080 );

console.log( 'Broker is running' );