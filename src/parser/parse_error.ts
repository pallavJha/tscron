class ParseError extends BaseError {
    constructor (public message: string) {
        super();
    }
}

const parseError = new ParseError("invalid format for the cron, follow * * * * *");
