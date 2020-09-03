const root_path = __dirname + '/dump' ;
const connector = require('liqd-sql');

module.exports = class SQL
{
    #uid; #type; #DB;

    constructor( uid, options = {})
    {
        this.#uid = uid;

        if( options.type )
        {
            this.#type = options.type;

            if( this.#type === 'mysql' )
            {
                this.#DB = new connector({
                    mysql: {
                        host     : 'localhost',
                        user     : 'root',
                        password : 'testtest1'
                    }
                });
            }
            else { console.log( this.#type + ' is not supported yet' ); }
        }
        else { console.log( 'SQL type is missing' ); }
    }

    async uid_check()
    {
        let check = await this.#DB.query( 'SHOW DATABASES LIKE \''+ this.#uid +'\';' ).execute();

        if( check.ok  )
        {
            return true;
        }
        else { console.log( 'Database not existing' ); return false; }
    }

    async create_db()
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

        return false;
    }

    get dump()
    {
        let path = root_path + '/' + this.#uid +'.'+ ( new Date ).getTime() +'.sql';
        let tmp_file_path = this.#uid +'.'+ ( new Date ).getTime() +'.sql';
        let path_tar = root_path + '/' + this.#uid +'.'+ ( new Date ).getTime() +'.sql.tar.gz';

        let exec = require('child_process').execSync;

        var child = exec('mysqldump -u '+ this.#uid +'_admin -phrasko1 '+ this.#uid +' > '+ tmp_file_path );
        var tar = exec('tar -czf ' + path_tar + ' ' + tmp_file_path );
        var remove_sql = exec('rm -r ' + tmp_file_path );

        return path;
    }
}