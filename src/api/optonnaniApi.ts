import { IPrompt } from "../interfaces/IPrompt";
import app from "../providers/expressProvider";
import { handleGptResponse } from "../services/gptService";
import { constants } from "../util/constants";
import { isTruthy } from "../util/util";

const promptArr: IPrompt[] = [];

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
     * POST for /optonnani
     */
    app.post('/optonnani', async (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', constants.FRONTEND_URL);
        console.info("\nPOST for /optonnani got called");

        const data = req.body;

        if (!isTruthy(data)) {
            res.status(400)
                .send({
                    data: null,
                    message: 'Bad Request',
                });
            return;
        }

        promptArr.push({
            userId: "Frontend",
            text: data.message,
        });

        console.log("req.body data:", data);
        console.log("PromptArr:", promptArr);

        let gptResponse = await handleGptResponse(data.message)
            .catch((err) => {
                console.error("Error handling GPT Response: ", err);
            });

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
