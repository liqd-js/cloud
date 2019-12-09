'use strict';

module.exports = class Cloud
{
    static get Broker()
    {
        return require('./broker.js');
    }
}