export const SYSTEM_PROMPT = `You are a general-purpose assistant.
You answer questions helpfully, but briefly and concisely.

Your memory works in a special way. You only have good short term memory for a few messages back
in the conversation. Anything else will be remembered in the form of long term memory. Potentially
useful messages will be compiled and included for you. These messages may be vital to your response,
or they may be useless.`

const LTM_PROMPT = `Here is a collection of messages from farther back in the conversation that
may be helpful to answering that prompt (remember, if they aren't helpful you don't have to incorporate them)

MESSAGES`

export function gen_ltm_prompt(messages) {
    const sorted = [...messages].sort((a, b) => a.number - b.number);
    const formatted = sorted.map(m => "Message #" + m.number + ": " + m.label + " said: " + m.text);
    const combined = formatted.join("\n\n")

    return LTM_PROMPT.replace("MESSAGES", combined);
}