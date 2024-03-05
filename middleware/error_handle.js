
import { constant } from "../constants.js";

export const errorHandle = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {

        case 404:
            res.json({ Title: "Request Not Found, ERROR:404", Message: err.message, ok: false, stackTrace: err.stackTrace });
            break;

        case 403:
            res.json({ Title: "Validation Error, ERROR:403", Message: err.message, ok: false, stackTrace: err.stackTrace });
            break;

        case 400:
            res.json({ Title: "Bad Request, ERROR:400", Message: err.message, ok: false, stackTrace: err.stackTrace });
            break;

        case 500:
            res.json({ Title: "Internal Server Error, ERROR:500", Message: err.message, ok: false, stackTrace: err.stackTrace });
            break;

        default:
            res.json({ Title: "Something went Wrong, Try again or report the issue", ok: false });

    };
}

