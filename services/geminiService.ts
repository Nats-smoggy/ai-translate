import { TranslationData } from "../types";

// 使用 DeepSeek API
const API_URL = "https://api.deepseek.com/chat/completions";
// 使用你提供的 DeepSeek Key
const DEEPSEEK_API_KEY = "你的 DeepSeek Key";

export const translateText = async (text: string): Promise<TranslationData> => {
  // 直接使用硬编码的 DeepSeek Key，忽略环境变量中的 Gemini Key
  const apiKey = DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("未配置 API Key");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个专业的翻译助手。
任务 1: 将用户的中文输入翻译成英文。
任务 2: 从翻译后的英文内容中提取 3 个核心关键词。

请务必以纯 JSON 格式返回结果，不要包含 Markdown 格式标记（如 \`\`\`json）。
JSON 格式要求如下：
{
  "translation": "英文翻译内容",
  "keywords": ["Keyword1", "Keyword2", "Keyword3"]
}`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" },
        temperature: 1.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DeepSeek API Error:", errorData);
      throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 返回内容为空");
    }

    return JSON.parse(content) as TranslationData;
  } catch (error) {
    console.error("Translation service error:", error);
    throw new Error(error instanceof Error ? error.message : "翻译服务暂时不可用，请稍后重试。");
  }
};