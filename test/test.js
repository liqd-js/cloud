const classka = require('./class.js');
const classka2 = require('./class2.js');

const instance = new classka();

for( let i = 0; i < 10; ++i )
{
    instance.service('testik').trulo( 'janko', 'hrasko' ).then( console.log );
}