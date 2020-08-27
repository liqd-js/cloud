
const root_path = __dirname + '/drive' ;
const fs = require('fs');

module.exports = class Drive
{
    #uid; #path;

    constructor( uid, options = {})
    {
        this.#uid = uid;
        this.#path = root_path + '/' + this.#uid;

        if( !fs.existsSync( this.#path ) )
        {
            fs.mkdirSync( this.#path, { recursive: true });

            if( !fs.existsSync( this.#path ) )
            {
                console.log( 'path error' );
            }
            else { console.log( 'path created' ); }
        }
        else { console.log( 'path exist' ); }
    }

    get root()
    {
        return this.#path;
    }
}