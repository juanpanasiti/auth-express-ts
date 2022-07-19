import { Location, Result, ValidationError } from "express-validator";

export interface JsonResponse {
    response_data: object | string | null;
    errors: ErrorResponse[] | Result<ValidationError>;
}

interface ErrorResponse {
    msg: string;
    param?: string;
    location?: Location;
    value?: string;
}
