import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Helper function to get the model
export function getModel(modelName: string = 'gemini-2.5-flash') {
  return genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.7,
    },
  })
}

