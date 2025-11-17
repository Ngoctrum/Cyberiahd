
import { GoogleGenAI, Type } from "@google/genai";
import type { ProductData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const productSchema = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "The full name of the product."
    },
    price: {
      type: Type.NUMBER,
      description: "The numerical price of the product. Extract only the numbers, no currency symbols, commas, or dots."
    },
    imageUrl: {
      type: Type.STRING,
      description: "The direct URL of the main product image."
    },
  },
  required: ["productName", "price", "imageUrl"],
};


export const fetchProductInfo = async (url: string): Promise<ProductData> => {
  try {
    const prompt = `Từ URL của sản phẩm Shopee này: "${url}", hãy trích xuất các thông tin sau: tên đầy đủ của sản phẩm, giá của sản phẩm (chỉ lấy số, không bao gồm "đ" hay bất kỳ ký tự nào khác), và URL hình ảnh chính của sản phẩm.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: productSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData: ProductData = JSON.parse(jsonText);
    
    return parsedData;

  } catch (error) {
    console.error("Error fetching product info from Gemini API:", error);
    throw new Error("Failed to fetch product data from Gemini.");
  }
};
