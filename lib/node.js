'use strict';

const { NOOP } = require('./helpers.js');
const Options = require('@liqd-js/options');
const { Server } = require('@liqd-js/websocket');
const Client_JSONRPC = require('@liqd-js/client-jsonrpc');

module.exports = class Node
{
    #brokers; #services;

    constructor( brokers, options = {})
    {
        this.#brokers = id || this.constructor.id;

        if( !this.#id )
        {
            throw new Error( 'Missing "id" in Service class "' + this.constructor.name + '"' );
        }

        Services.set( this.#id, this );
    }
}