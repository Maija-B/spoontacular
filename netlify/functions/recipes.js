import fetch from "node-fetch";

export async function handler(event, context) {
  // turns the event(information) passed by the API into a js object
  const params = event.queryStringParameters || {};
  //   || {} tells us to just use {} if event.queyStringParameters is going to throw an arror
  const query = params.query || "";

  const API_KEY = process.env.SPOONTACULAR_API_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API key on server" }),
    };
  }
}

const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";
const url = new URL(baseUrl);
if (query) url.searchParams.append("query", query);
if (diet) url.searchParams.append("diet", diet);
if (intolerances) url.searchParams.append("intolerances", intolerances);
url.searchParams.append("number", number);
url.searchParams.append("addRecipeInformation", "true"); // include more details
url.searchParams.append("apiKey", API_KEY); // auth via query param

try {
  // 4) Call Spoonacular from the server (key is used here, hidden from client)
  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const text = await resp.text();
    return {
      statusCode: resp.status,
      body: JSON.stringify({ error: text }),
    };
  }
  const data = await resp.json();

  // 5) Return the Spoonacular JSON straight to the frontend
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
} catch (err) {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: err.message }),
  };
}
