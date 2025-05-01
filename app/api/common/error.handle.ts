import axios from "axios";
import {ErrorResponse} from "@/app/api/common/error.interface";
export function handleError(error: ErrorResponse | unknown): { error: string } {
    if (axios.isAxiosError(error) && error.response) {
        return {
            error: error.response.data.message
        };
    }
    return { error: 'An unknown error occurred' };
}