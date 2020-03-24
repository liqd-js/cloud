'use strict';

const Service = require('../lib/service');
const Class1 = require('./class');

const instance = new Class1();

console.log( Class1.prototype instanceof Service );
console.log( instance instanceof Service );

const Spawn = ( command, args, directory ) => new Promise(( resolve, reject ) =>
{
    const cmd = require('child_process').exec( command, { cwd: directory }, ( err, stdout, stderr ) => 
    {
        console.log( err, stdout, stderr );

        err ? reject( err ) : resolve();
    });

    /*
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    

    cmd.on( 'close', code => code ? reject( code ) : resolve() );*/
});

//zip -r myarchive.zip dir1 -x dir1/ignoreDir1/**\* dir1/ignoreDir2/**\*

Spawn( 'zip -r acme-total.zip @com.acme.foo:bar:foobar -x "*/node_modules/*" "*/package-lock.json"', [], __dirname + '/repository' ).then( v => console.log('Hura') );
