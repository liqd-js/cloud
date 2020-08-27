

module.exports = class Resource
{
    async Drive( uid, options = {} )
    {
        return new ( require('./resource/drive.js') )( uid, options  );
    }
}