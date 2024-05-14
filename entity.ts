const { NlpManager } = require('@nlpjs/nlp');

const manager = new NlpManager({ languages: ['en'] });

async function processText(text) {
    await manager.train();
    const response = await manager.process('en', text);
    console.log(response);
}

const text = "Mark Zuckerberg is the CEO of Facebook, a company from the United States.";

processText(text);
