'use strict';

const fs = require('fs');
const Options = require('@liqd-js/options');
const Server = require('@liqd-js/server');

module.exports = class Repository
{
    #server; #options;

    constructor( options = {})
    {
        this.#options = Options( options,
        {
            port : { _required: true, _type: 'number', _convert: parseInt }
        });

        this.#server = new Server();

        this.#server.get(( req, res, next ) =>
        {
            let pckg = req.path.substr(1);

            res.reply( fs.readFileSync( __dirname + '/../test/repository/' + pckg.replace( /\//g, ':' ) + '/package.json' ));
        });

        this.#server.put(( req, res, next ) =>
        {
            
        });

        this.#server.listen( this.#options.port );
    }

    destroy()
    {
        this.#server.close();
    }
}