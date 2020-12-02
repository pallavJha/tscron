export class BaseError {
    constructor () {
        Error.apply(this);
    }
}

BaseError.prototype = new Error();
