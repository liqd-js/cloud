const { Service } = require('../lib/cloud.js');

Service.init([ 'ws://localhost:8080' ]);

const Classka2 = module.exports = class Classka2 extends Service
{
    constructor()
    {
        super( 'class2' );
    }

    get()
    {
        return this.service('class1').go();
    }

    go()
    {
        setTimeout(() => this.get().then( console.log ), 1000 );
        
        return 'ja som class2';
    }
}

const instance = new Classka2();

setTimeout(() => instance.get().then( console.log ), 1000 );