'use strict';

const Cloud = require('../lib/cloud.js');

async function test_drive( uid )
{
    let data = await Cloud.Resource.Drive( uid );

    console.log( data.root );
}

test_drive( 'test_2' );