const Service = require('../service.js');

module.exports = class Classka extends Service
{
    static id = 'idecko staticke';

    constructor()
    {
        super();
    }

    go()
    {
        return this.service( 'test' );
    }
}