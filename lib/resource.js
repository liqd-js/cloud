

module.exports = class Resource
{
    async Drive( uid, options = {} )
    {
        return new ( require('./resource/drive.js') )( uid, options  );
    }

    async SQL( uid, options = {} )
    {
        let sql = new ( require('./resource/sql.js') )( uid, options  )

        let check = await sql.uid_check();

        if( !check )
        {
            let create = await sql.create_db();
        }

        return sql;
    }
}