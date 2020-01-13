const { Service } = require('../lib/cloud.js');

Service.init([ 'ws://localhost:8080' ]);

const Class1 = module.exports = class Class1 extends Service
{
    static id = 'class1';

    constructor()
    {
        super();
    }

    get()
    {
        return this.service('class2').go();
    }

    go()
    {
        setTimeout(() => this.get().then( console.log ), 1000 );

        return 'ja som class1';
    }
}

const instance = new Class1();

