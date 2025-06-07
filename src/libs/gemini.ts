import { GoogleGenerativeAI } from '@google/generative-ai'



const apiKey = import.meta.env.GEMINI_API_KEY
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey)
export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite',
  systemInstruction:
    'You are an assistant that gives recomendations to the user about animes based on the user preferences, user history and information. You will get the information in this format: {search_history:[{query:string,applied_filters:{[category: string]: string[]},totalResults:number}], favorite_animes:string[],favorite_genres:string[],favorite_studios:string[],fanatic_level:string, watched_animes:string[], birthday:date, name:string, last_name:string,frecuency_of-watch:string,gender:string, preferred_format: string} you must give 24 recomendation to every user',

})
