
const SQL = require('liqd-sql');

module.exports = class Drive
{
    #uid; #DB;

    constructor( uid, options = {})
    {
        this.#uid = uid;

        if( options.type )
        {
            if( options.type === 'mysql' )
            {
                this.#DB = new SQL({
                    mysql: {
                        host     : 'localhost',
                        user     : 'root',
                        password : 'testtest1'
                    }
                });
            }
            else { console.log( options.type + ' is not supported yet' ); }
        }
        else { console.log( 'SQL type is missing' ); }
    }

    async create_mysql_db()
    {
        let database = await this.#DB.database( this.#uid ).create( {} );

        if( database.ok )
        {
            let user = await this.#DB.query( 'CREATE USER \'' + this.#uid +'_admin\'@\'localhost\' IDENTIFIED BY \'hrasko1\';' ).execute();

            if( user.ok )
            {
                let privilegies = await this.#DB.query( 'GRANT ALL ON '+ this.#uid +'.* TO \''+ this.#uid +'_admin\'@\'localhost\';' ).execute();

                if( privilegies.ok )
                {
                    console.log( 'Done' );
                    return true;
                }
                else{ console.log( 'Privilege granting failed' ); console.log( privilegies ); }
            }
            else{ console.log( 'User creating failed' ); console.log( user ); }
        }
        else { console.log( 'DB creating failed' ); console.log( database ); }
    }
}