module.exports = function Err( error )
{
    if( error instanceof Error )
    {
        error = 
        {
            code    : 503, 
            message : error.message,
            data:
            {
                name    : error.name,
                file    : error.fileName,
                line    : error.lineNumber,
                column  : error.columnNumber,
                stack   : error.stack
            }
        }

        if( !error.data.filename && error.data.stack )
        {
            let lines = error.data.stack.split(/\s*\n\s*/);
            let info =  ( lines[1] && lines[1].match(/.*\((?<file>[^:]+):(?<line>[0-9]+):(?<column>[0-9]+)\)/)) ||
                        lines[0].match(/(?<file>[^:]+):(?<line>[0-9]+):(?<column>[0-9]+)/);
            info && Object.assign( error.data, info.groups );
        }
    }

    return error;
}