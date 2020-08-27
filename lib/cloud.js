'use strict';

module.exports = class Cloud
{
    static get Broker()
    {
        return require('./broker.js');
    }

    static get Service()
    {
        return require('./service.js');
    }

    static get Node()
    {
        return require('./node.js');
    }

    static get Resource()
    {
        return new ( require('./resource.js'));
    }
}