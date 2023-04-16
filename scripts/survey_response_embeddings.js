// const fs = require("fs");
// import fs instead
import fs from "fs";
// const { Configuration, OpenAIApi } = require("openai");
import { Configuration, OpenAIApi } from "openai";
// const dotenv = require("dotenv");
import dotenv from "dotenv";
// add d3-dsv
// const d3 = require("d3-dsv");
import { csvParse } from "d3-dsv";
dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const surveyResponses = fs.readFileSync("./data/data2022main_CLEANED.csv", "utf-8");

const surveyResponsesParsed = csvParse(surveyResponses)




// Now we are going to use openAI to make an embedding for every survey response
// We will use the following function to make the request to the openai api
async function getEmbeddingFromResponse(surveyResponseText, i) {
  let embedding
  try {
    const openAIResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: JSON.stringify(surveyResponseText),
    });
    embedding = {
      ...openAIResponse.data,
      id: i,
    };

    console.log(`embedding ${i} created`);

    const embeddingFilename = `./data/embeddings/${i}.json`;

    // Save the embedding to a file
    fs.writeFileSync(embeddingFilename, JSON.stringify(embedding));
  } catch (error) {
    console.log(error);
  }
}

// now we are going to make an array of promises
// each promise will be a request to the openai api
const promises = surveyResponsesParsed.map(async (response, i) => {
  await getEmbeddingFromResponse(response, i);
});
// wait for all the requests to finish
const embeddings = await Promise.all(
  promises.map((p) => p.catch((e) => e))
);

// save the labels to a json file
fs.writeFileSync("./survey_embeddings.json", JSON.stringify(embeddings));
