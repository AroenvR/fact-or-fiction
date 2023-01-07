import { IPrompt } from "../interfaces/IPrompt";
import app from "../providers/expressProvider";
import { handleGptResponse } from "../services/gptService";
import { constants } from "../util/constants";
import { isTruthy } from "../util/util";

/**
 * Starts the Optonnani Service.
 */
export const runOptonnaniApi = () => {
    console.log("/optonnani is listening");

    /**
     * GET for /foo
     */
    app.get('/optonnani', (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', constants.FRONTEND_URL);
    
        console.log("GET for /optonnani got called");
    
        res.status(200)
            .send({
                data: 'Hello from optonnani!',
            });
    });

    /**
     * POST for /optonnani/question
     */
    app.post('/optonnani/question', async (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', constants.FRONTEND_URL);
        console.info("\nPOST for /optonnani/question got called");
        const data = req.body;

        if (!isTruthy(data)) {
            console.error("/optonnani POST: falsy data received. Returning bad request.");
            res.status(400)
                .send({
                    data: null,
                    message: 'Bad Request',
                });
            return;
        }

        let gptResponse = await handleGptResponse(data.message)
            .catch((err) => {
                console.error("Error handling GPT Response: ", err);
            });

        console.log("Received data:", data);
        console.log("Returning:", gptResponse.data.choices[0].text);

        res.status(201)
            .send({
                data: { 
                    id: 1, 
                    data: gptResponse.data.choices[0].text.replace("\n", ""),
                },
                message: "success",
            });
    });

    /**
     * POST for /optonnani/statement
     */
    app.post('/optonnani/statement', async (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', constants.FRONTEND_URL);
        console.info("\nPOST for /optonnani/statement got called");
        const data = req.body;

        if (!isTruthy(data)) {
            console.error("/optonnani POST: falsy data received. Returning bad request.");
            res.status(400)
                .send({
                    data: null,
                    message: 'Bad Request',
                });
            return;
        }

        let gptResponse = await handleGptResponse(data.message)
            .catch((err) => {
                console.error("Error handling GPT Response: ", err);
            });

        console.log("Received data:", data);
        console.log("Returning:", gptResponse.data.choices[0].text);

        res.status(201)
            .send({
                data: { 
                    id: 1, 
                    data: gptResponse.data.choices[0].text.replace("\n", ""),
                },
                message: "success",
            });
    });
}

/*
    Working on setup prompts for question card generation:

    Generate a question for a trivia game about nature as well as the correct answer.
    The question should be a factual statement that can be answered with a single word or phrase.
*/

/*
    Working on setup prompts for answer card generation:

    Generate 4 statements for a trivia game.
    The statement should be a humorous and untrue statement which could seem true relation to the following fact:
    "What is the highest mountain peak in North America?"

    Points: 8/10
    Generate 4 statements for a trivia game. The statements should be humorous and untrue statements meant to be satirical and absurd to the following fact: "What is the highest mountain peak in North America?"

    Points: 8/10
    Generate 4 statements between 10 and 25 words for a trivia game. The statements should be humorous and untrue statements meant to be satirical and absurd to the following fact: What is the only mammal that can fly?
*/