import * as dotenv from 'dotenv'; dotenv.config();
import { Configuration, OpenAIApi } from "openai";
import { IErrorResponse } from '../interfaces/IErrorResponse';
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai: any = new OpenAIApi(configuration);

/**
 * Sends a message to OpenAI to query an AI with.
 * @param prompt string to query the AI with.
 * @returns a response from OpenAI in "" format.
 */
export const handleGptResponse = async (prompt: string): Promise<any | IErrorResponse> => {
    return await openai.createCompletion({
        model: "text-davinci-003", // https://help.openai.com/en/articles/6643408-how-do-davinci-and-text-davinci-003-differ
        prompt: prompt,
        max_tokens: 100, // 2 questions with 16 statements each (all one sentence large) = 210 tokens.
        temperature: 0.9, // May have to lower this value.
        // top_p: 1, // Best not alter this if temperature is altered.
        frequency_penalty: 0,
        presence_penalty: 0.6,
    })
    .catch((err: any) => {
        throw handleGptResponseError(err);
    });
}

/**
 * Handles errors from OpenAI.
 * @param err error from OpenAI.
 * @returns a response from OpenAI in "" format.
 */
const handleGptResponseError = (err: any): IErrorResponse => {
    // Check for different types of errors and return appropriate status codes and messages
    switch (err.response.status) {
        case 400:
          return { status: 400, message: "Bad request: Invalid input parameters or invalid request format." };

        case 403:
          return { status: 403, message: "Forbidden: Incorrect API key or insufficient permissions." };

        case 429:
          return { status: 429, message: "Too many requests: Rate limit exceeded." };

        case 500:
          return { status: 500, message: "Internal server error: An unexpected error occurred on the server." };

        case 503:
            return { status: 503, message: "Service unavailable: The OpenAI server is currently unavailable." };

        default:
          return { status: 500, message: "Unknown error." };
    }
}