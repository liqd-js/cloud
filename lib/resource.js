

module.exports = class Resource
{
    async Drive( uid, options = {} )
    {
        return new ( require('./resource/drive.js') )( uid, options  );
    }

    async SQL( uid, options = {} )
    {
        let sql = new ( require('./resource/sql.js') )( uid, options  )

        if( options.type )
        {
            if( options.type === 'mysql' )
            {
                return await sql.create_mysql_db();
            }
            else { return { ok: false, error: options.type + ' is not supported yet' }; }
        }
        else { return { ok: false, error: 'SQL type is missing' } }
    }
}