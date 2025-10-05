
import { GoogleGenAI, GenerateContentResponse, Content, Chat } from "@google/genai";
import { Exoplanet } from "../types";

// In a real application, the API key would be handled securely and not exposed here.
// For this project, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReport = async (analysisData: any): Promise<string> => {
    console.log("Calling Gemini API with data:", analysisData);
    const { model, accuracy, hyperparameters, fileName } = analysisData;

    const prompt = `
        Analyze the following exoplanet detection model training results and generate a concise, insightful report suitable for a researcher.

        **Input Data:**
        - Dataset: ${fileName || 'User-Uploaded Data'}
        - Model Used: ${model}
        - Achieved Accuracy: ${accuracy}%
        - Hyperparameters:
            - N Estimators: ${hyperparameters.estimators}
            - Max Depth: ${hyperparameters.depth}

        **Report Requirements:**
        Your report should be structured with markdown headings and include:
        1.  **Executive Summary:** A brief overview of the model's performance and key takeaways.
        2.  **Performance Analysis:** Interpret what the accuracy score implies. Is it a strong result for this type of problem? What might the hyperparameters suggest about the data's complexity?
        3.  **Key Findings & Potential Discoveries:** Based on the model's success, speculate on what was likely found. Invent 2-3 plausible, high-potential exoplanet candidates that this model might have identified (e.g., "ED-2024-C1, a potential 'Super-Earth' in the Cygnus field..."). Be creative but scientifically grounded.
        4.  **Recommendations & Next Steps:** Suggest concrete next steps, such as observational follow-up for the fictional candidates, further hyperparameter tuning, or using a different model architecture.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: 'You are Exo-AI, an expert AI assistant for the ExoDiscover platform, specializing in astrophysics and exoplanet research. Provide clear, professional, and data-driven analysis in markdown format.',
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "### AI Report Generation Failed\n\nAn error occurred while contacting the Gemini API. This could be due to a network issue, an invalid API key, or a problem with the AI model service. Please check the console for more details and try again later.";
    }
};

export const generateComparisonReport = async (planetA: Exoplanet, planetB: Exoplanet, esiA: number, esiB: number): Promise<string> => {
    const prompt = `
        Generate a concise, expert comparison between two exoplanets for the ExoDiscover AI platform.
        Focus on habitability and key differences. Use markdown formatting and a professional, slightly enthusiastic tone.

        **Planet A: ${planetA.name}**
        - Radius: ${planetA.radius.toFixed(2)}x Earth
        - Mass: ${planetA.mass.toFixed(2)}x Earth
        - Orbital Period: ${planetA.orbitalPeriod} days
        - Insolation Flux: ${planetA.insolation.toFixed(2)}x Earth's
        - Star Type: ${planetA.starType}
        - Earth Similarity Index (ESI): ${esiA.toFixed(3)}

        **Planet B: ${planetB.name}**
        - Radius: ${planetB.radius.toFixed(2)}x Earth
        - Mass: ${planetB.mass.toFixed(2)}x Earth
        - Orbital Period: ${planetB.orbitalPeriod} days
        - Insolation Flux: ${planetB.insolation.toFixed(2)}x Earth's
        - Star Type: ${planetB.starType}
        - Earth Similarity Index (ESI): ${esiB.toFixed(3)}

        **Analysis Requirements:**
        1.  **Overview:** Start with a one-sentence summary comparing the two.
        2.  **Habitability Potential:** Briefly assess which planet seems more promising for life and why, considering their ESI, star type, and insolation.
        3.  **Key Differentiators:** Use bullet points to highlight the most significant differences (e.g., size, potential composition, star environment).
        4.  **Conclusion:** A concluding sentence on their significance in the search for habitable worlds.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: 'You are Exo-AI, an expert AI assistant specializing in comparative planetology. Provide clear, data-driven insights.',
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed for comparison report:", error);
        return "An error occurred while generating the AI comparison. Please check the console for details.";
    }
};

export const generateLiveAnalysisReport = async (summary: any, findings: any): Promise<string> => {
    const prompt = `
        As an AI astrophysics assistant for the ExoDiscover platform, analyze the provided data summary and AI findings from an uploaded user dataset. Generate a professional, structured report in markdown format.

        **Provided Data Summary:**
        - File Name: ${summary.fileName}
        - Total Rows: ${summary.rows}
        - Columns: ${summary.columns.join(', ')}
        - Contains Time-Series Data: ${summary.isTimeSeries ? 'Yes' : 'No'}

        **AI/ML Analysis Findings (Simulated):**
        - Potential Exoplanet Candidates Identified: ${findings.candidates}
        - Confidence Score (Avg): ${(findings.confidence * 100).toFixed(1)}%
        - Most Promising Candidate (Fictional): 
            - Name: ${findings.topCandidate.name}
            - Estimated Period: ${findings.topCandidate.period} days
            - Estimated Size: ${findings.topCandidate.radius}x Earth
            - Habitability Index (ESI): ${findings.topCandidate.esi.toFixed(2)}

        **Your Task: Generate the Full Report**
        Use the data above to create a report with the following four sections. Be professional, insightful, and slightly speculative where appropriate to engage the user.

        1.  **Dataset Summary:**
            - Briefly describe the structure of the uploaded data (${summary.fileName}). Mention the number of rows and key columns you've identified. Comment on the presence of time-series data and its importance.

        2.  **AI/ML Analysis Results:**
            - State the number of candidates detected and the model's average confidence.
            - Elaborate on the most promising candidate (${findings.topCandidate.name}). Discuss its characteristics (period, size, ESI) and what they might imply (e.g., "This suggests a potential 'Super-Earth' orbiting within its star's habitable zone...").

        3.  **Visualizations:**
            - **(This is a placeholder for the report text)** Describe the visualization you would generate. If time-series data was present, state: "A light curve was generated, showing a clear periodic dip consistent with a planetary transit for candidate ${findings.topCandidate.name}." If not, state: "A feature importance chart was generated, highlighting the key parameters that influenced the detection model."

        4.  **Recommendations:**
            - Provide clear, actionable next steps for a researcher. For example:
                - Suggest follow-up observations with ground-based telescopes to confirm the candidate.
                - Recommend further data cleaning or model tuning.
                - Propose using a different detection algorithm to verify the findings.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: 'You are Exo-AI, an expert AI assistant specializing in exoplanet data analysis. You are generating a final report based on pre-computed findings. Format the output in clean markdown.',
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed for live analysis report:", error);
        return "### AI Report Generation Failed\n\nAn error occurred while contacting the Gemini API. Please check the console for details.";
    }
}

// --- New Optimized Chat Functionality ---
interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export const continueChat = async (messages: Message[], newMessageText: string): Promise<string> => {
    const history: Content[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: {
            systemInstruction: 'You are Exo-AI, a friendly and knowledgeable assistant for the ExoDiscover platform. You are an expert in exoplanets, astronomy, and using AI for space exploration. Answer user questions concisely and enthusiastically. Keep your answers to a few sentences unless asked for more detail. Use markdown for formatting when appropriate (like lists).',
        },
    });
    
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message: newMessageText });
        return response.text;
    } catch (error) {
        console.error("Gemini chat API call failed:", error);
        return "I seem to be having trouble connecting to my network. Please try sending your message again.";
    }
};