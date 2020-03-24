'use strict';

const Service = require('./service');

module.exports = class Router
{
    #local_services = new Map();
    #remote_services = new Map();

    constructor( node )
    {

    }

    add( entry )
    {
        if( entry instanceof Service )
        {
            console.log( 'isService' );
        }
        else
        {
            console.log( 'isNotService' );
        }
    }

    call(  )
    {

    }

    event(  )
    {

    }
}