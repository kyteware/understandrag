import { signal } from "@preact/signals-core";
import { gen_ltm_prompt, SYSTEM_PROMPT } from "./prompts";

const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

let llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: "."
})

export const haveKey = signal(false);
export async function setKey(key) {
    llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0,
        apiKey: key
    })
    haveKey.value = false;
    llm.invoke([{role: "user", content: "respond with the word hi (say nothing else)"}])
      .then(result => {
        if (result.content.toLowerCase().trim() == "hi") {
          console.log("key validated");
          haveKey.value = true;
        } else {
          console.log("a test call to google worked but the llm didnt say hi back??");
        }
      })
      .catch(error => {
        console.log(error);
      })
}

export async function prompt(messages, retrieved = null, config) {
    const labelled_messages = messages.slice(-config.stmLength * 2).map(message => {return {role: message.label, content: message.text}});

    const messages_with_extras = [{role: "system", content: SYSTEM_PROMPT}, ...labelled_messages];
    if (!(retrieved === null)) {
      const retrieved_text = gen_ltm_prompt(retrieved);
      messages_with_extras[0].content = SYSTEM_PROMPT + "\n\n-\n\n" + retrieved_text;
    }

    const output = await llm.invoke(messages_with_extras)
    return output.content;
}

const q_embdr = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: "AIzaSyBMO7HoWRPewxpkyGVoSCDAGoJlrTBriv0",
    taskType: "RETRIEVAL_QUERY"
});
const d_embdr = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: "AIzaSyBMO7HoWRPewxpkyGVoSCDAGoJlrTBriv0",
    taskType: "RETRIEVAL_DOCUMENT"
});

// from: https://github.com/PaulKinlan/idb-vector/blob/main/index.js
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, aVal, idx) => sum + aVal * b[idx], 0);
  const aMagnitude = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
  const bMagnitude = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
  return dotProduct / (aMagnitude * bMagnitude);
}

// export async function store(message) {
//     const text = /*message.label + " said: " + */ message.text;
//     console.log("storing + " + text);
//     vectorStore.push({
//         text: text,
//         embedding: await d_embdr.embedQuery(text)
//     });
// }

export async function query(text, num, messages) {
    const vec = await q_embdr.embedQuery(text);

    // derived from https://github.com/PaulKinlan/idb-vector/blob/main/index.js
    const res = [];

    for (const message of messages) {
        if (message.embedding === undefined) {
            message.embedding = await d_embdr.embedQuery(message.text);
        }

        const similarity = cosineSimilarity(vec, message.embedding);
        add_if_worthy(message, similarity, res, num);
    }

    console.log(res);

    return res.reverse().map(pair => pair[0]);
}

function add_if_worthy(item, worth, best_so_far, max_n) {
    const sort = () => best_so_far.sort((a, b) => a[1] - b[1]);
    if (best_so_far.length < max_n) {
        best_so_far.push([item, worth])
        sort();
        return
    }

    if (worth > best_so_far[0][1]) {
      best_so_far[0] = [item, worth];
      sort()
    }
}

