import OpenAI from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from 'openai/resources/index.mjs';
import { getWebPageContent, getWebSearchResults } from './tools/browser';
import { sendMessage } from '../telegram';
import { updateUser } from '../user';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askChatbot = async (
  prompt: string,
  senderId: number,
  user: any
) => {
  const model = 'gpt-4-turbo';
  const maxTokens = 500;
  const messages: any[] = user.data?.messages || [];
  console.log('messages', messages);

  messages.push({ role: 'user', content: prompt });

  const tools: any[] = [
    {
      type: 'function',
      function: {
        name: 'get_web_search_results',
        description:
          'Search for information from the internet in real-time using Google Search.',
        parameters: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'The search keyword',
            },
          },
          required: ['keyword'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'read_web_page_content',
        parameters: {
          type: 'object',
          required: ['url'],
          properties: {
            url: {
              type: 'string',
              description: 'URL of the article to be summarized',
            },
          },
        },
        description: 'Read the content of a web page via its URL.',
      },
    },
  ];

  const response = await openai.chat.completions.create({
    messages,
    model,
    tools,
    max_tokens: maxTokens,
  });
  const responseMessage = response.choices[0].message;

  // Step 2: check if the model wanted to call a function
  const toolCalls: ChatCompletionMessageToolCall[] =
    responseMessage.tool_calls || [];
  if (responseMessage.tool_calls) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors
    const availableFunctions: any = {
      get_web_search_results: getWebSearchResults,
      read_web_page_content: getWebPageContent,
    };
    const availableFunctionArgs: any = {
      get_web_search_results: ['keyword'],
      read_web_page_content: ['url'],
    };
    messages.push(responseMessage); // extend conversation with assistant's reply
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgsObj = JSON.parse(toolCall.function.arguments);
      const functionArgs = availableFunctionArgs[functionName].map(
        (arg: string) => functionArgsObj[arg]
      );

      const functionResponse = await functionToCall(...functionArgs);
      const functionResponseStr = JSON.stringify(functionResponse);
      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        name: functionName,
        content: functionResponseStr,
      }); // extend conversation with function response

      sendMessage(
        senderId,
        `Function ${functionName} called with args: ${functionArgs}, response: ${functionResponseStr.slice(
          0,
          100
        )}`
      );
    }
    const secondResponse = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
    }); // get a new response from the model where it can see the function response

    updateUser(senderId, { messages });
    const responseMessage2 = secondResponse.choices[0].message.content;
    if (responseMessage2) {
      sendMessage(senderId, responseMessage2);
    }
  } else {
    messages.push(responseMessage);
    const responseMessageContent = responseMessage.content;
    if (responseMessageContent) {
      updateUser(senderId, { messages });
      sendMessage(senderId, responseMessageContent);
      return;
    }
  }
};
