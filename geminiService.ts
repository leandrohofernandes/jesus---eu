import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, DevotionalContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const devotionalSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    verse: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "O texto do versículo bíblico." },
        reference: { type: Type.STRING, description: "A referência (livro, capítulo, versículo)." }
      },
      required: ["text", "reference"]
    },
    spiritualExplanation: {
      type: Type.STRING,
      description: "Explicação pastoral breve conectando o versículo à luta contra o vício."
    },
    scientificBasis: {
      type: Type.STRING,
      description: "Explicação neurocientífica simplificada (dopamina, plasticidade, etc)."
    },
    reflectionQuestion: {
      type: Type.STRING,
      description: "Uma pergunta profunda para autoanálise."
    },
    concreteAction: {
      type: Type.STRING,
      description: "Uma ação prática e pequena para fazer hoje."
    },
    inevitabilityQuote: {
      type: Type.STRING,
      description: "Uma frase de impacto sobre a Lei da Inevitabilidade (repetição gera destino)."
    }
  },
  required: ["verse", "spiritualExplanation", "scientificBasis", "reflectionQuestion", "concreteAction", "inevitabilityQuote"]
};

export const generateDailyDevotional = async (profile: UserProfile): Promise<DevotionalContent | null> => {
  try {
    const addictions = profile.addictions.join(", ");
    const triggers = profile.triggers.join(", ");

    const prompt = `
      Você é um mentor espiritual e especialista em neurociência comportamental cristão.
      Crie um devocional diário para uma pessoa que luta contra: ${addictions}.
      Os gatilhos principais dela são: ${triggers}.
      A frequência da luta é: ${profile.frequency}.

      O tom deve ser acolhedor, sóbrio, esperançoso e não condenatório.
      
      Estrutura necessária:
      1. Versículo Bíblico: Focado em autocontrole, renovação da mente ou identidade.
      2. Explicação Espiritual: Breve.
      3. Base Científica: Explique de forma simples como o cérebro funciona em relação a este vício (fale sobre dopamina, circuitos de recompensa ou neuroplasticidade).
      4. Reflexão Prática: Uma pergunta para o usuário.
      5. Ação Concreta: Um desafio pequeno para hoje.
      6. Frase da Lei da Inevitabilidade: Algo sobre como pequenas repetições definem o destino.

      Responda APENAS com o JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for speed/cost effectiveness for text gen
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: devotionalSchema,
        temperature: 0.7,
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;

    const data = JSON.parse(jsonText);
    
    return {
      date: new Date().toISOString().split('T')[0],
      ...data
    };

  } catch (error) {
    console.error("Error generating devotional:", error);
    return null;
  }
};

export const getQuickEmergencyContent = async (profile: UserProfile): Promise<{text: string, reference: string} | null> => {
  try {
     const prompt = `
      O usuário está tendo um forte impulso (fissura) para recair no vício de: ${profile.addictions[0]}.
      Forneça UM único versículo bíblico curto e poderoso para ele ler AGORA e recuperar o controle.
      Retorne JSON: { "text": "...", "reference": "..." }
     `;

     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             text: { type: Type.STRING },
             reference: { type: Type.STRING }
          }
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
    return null;
  } catch (e) {
    console.error(e);
    return { text: "Sujeitai-vos, pois, a Deus, resisti ao diabo, e ele fugirá de vós.", reference: "Tiago 4:7" };
  }
}