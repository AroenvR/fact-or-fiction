import * as dotenv from 'dotenv'; dotenv.config();
import { Configuration, OpenAIApi } from "openai";
import { IErrorResponse } from '../interfaces/IErrorResponse';
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Sends a message to OpenAI to query an AI with.
 * @param prompt string to query the AI with.
 * @returns a response from OpenAI in "" format.
 */
export const handleGptResponse = async (prompt: string) => {
    let gptResponse: any;
    try {
        // return
        gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        })
        // .catch((err) => {
        //     return handleGptResponseError(err);
        // });
    } catch (err) {
        return handleGptResponseError(err);
    }
    
    return gptResponse;
}

/**
 * Handles errors from OpenAI.
 * @param err error from OpenAI.
 * @returns a response from OpenAI in "" format.
 */
const handleGptResponseError = (err: any): IErrorResponse => {
    // Check for different types of errors and return appropriate status codes and messages
    switch (err.constructor) {

        //@ts-ignore
        case openai.errors.BadRequestError:
          return { status: 400, error: "Bad request: Invalid input parameters or invalid request format." };

        //@ts-ignore
        case openai.errors.ForbiddenError:
          return { status: 403, error: "Forbidden: Incorrect API key or insufficient permissions." };

        //@ts-ignore
        case openai.errors.TooManyRequestsError:
          return { status: 429, error: "Too many requests: Rate limit exceeded." };

        //@ts-ignore
        case openai.errors.InternalServerError:
          return { status: 500, error: "Internal server error: An unexpected error occurred on the server." };

        default:
          return { status: 500, error: "Unknown error." };
    }
}