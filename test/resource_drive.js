'use strict';

const Cloud = require('../lib/cloud.js');
const SQL = require('liqd-sql');

async function test_drive( uid )
{
    let data = await Cloud.Resource.Drive( uid );

    console.log( data.root );
}

async function test_sql( uid )
{
    let data = await Cloud.Resource.SQL( uid, { type: 'mysql' } );

    if( data )
    {
        let DB = new SQL({
            mysql: {
                host     : 'localhost',
                user     : uid + '_admin',
                password : 'hrasko1',
                database : uid
            }
        });

        let query = await DB.query( 'SELECT 1 FROM DUAL' ).execute();

        if( query.ok )
        {
            console.log( 'SQL test passed', query );
        }
        else { console.log( 'SQL test failed' ); }
    }
    else { console.log( 'DB creating failed' ); }
}

test_drive( 'test_2' );
test_sql( 'janko1' );