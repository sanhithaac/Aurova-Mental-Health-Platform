import axios from 'axios';
import { authService } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE}/api/chat`;

export const chatService = {
    async sendMessage(text: string, sessionId: string, frontendContext?: string, language?: string) {
        // Full integration: call FastAPI NLP backend
        try {
            const response = await axios.post('http://localhost:8000/chat', {
                question: text
            });
            // Structure response for frontend
            return {
                sessionId,
                text,
                response: response.data.answer,
                context: response.data.context,
                entities: response.data.entities,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            console.error('❌ NLP Chatbot Error:', error);
            return {
                sessionId,
                text,
                response: 'Sorry, the NLP backend is unavailable.',
                context: [],
                entities: [],
                timestamp: new Date().toISOString()
            };
        }
    },

    mockNLPResponse(text: string, sessionId: string) {
        // Simulate model and dataset usage
        const models = ["Llama", "Sentence-BERT"];
        const datasets = ["OpenChat Dataset", "Aurova Wellness Dataset"];
        const model = models[Math.floor(Math.random() * models.length)];
        const dataset = datasets[Math.floor(Math.random() * datasets.length)];
        // Simple mock logic: echo user text with model/dataset reference
        return {
            sessionId,
            text,
            response: `This answer was generated using the ${model} model trained on the ${dataset}.\n\nSimulated response: Based on your input, '${text}', here is a helpful reply.`,
            model,
            dataset,
            timestamp: new Date().toISOString()
        };
    },

    async getHistory(sessionId: string) {
        try {
            const token = authService.getToken();
            console.log("🔑 History Fetch Token:", token ? "EXISTS" : "MISSING");

            if (!token) return [];

            const response = await axios.get(`${API_URL}/history/${sessionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error("❌ History fetch error:", error);
            return [];
        }
    },

    async getSessions(): Promise<Array<{ sessionId: string; lastMessage: string; lastAt: string; count: number }>> {
        try {
            const token = authService.getToken();
            if (!token) return [];
            const response = await axios.get(`${API_URL}/sessions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error: any) {
            console.error("❌ Sessions fetch error:", error);
            return [];
        }
    }
};
