exports.handler = async (event, context) => {
  // turns the event(information) passed by the API into a js object
  const params = event.queryStringParameters || {};
  // || {} tells us to just use {} if event.queryStringParameters is undefined
  const query = params.query || "";

  const diet = params.diet || "";
  const intolerances = params.intolerances || "";
  const number = params.number || 6; // default results amount

  const API_KEY = process.env.SPOONTACULAR_API_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API key on server" }),
    };
  }

  try {
    // Build URL for Spoonacular API
    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    url.searchParams.append("apiKey", API_KEY);
    url.searchParams.append("query", query);
    if (diet) url.searchParams.append("diet", diet);
    if (intolerances) url.searchParams.append("intolerances", intolerances);
    url.searchParams.append("number", number);

    // Fetch API
    const response = await fetch(url.toString());
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server failed" }),
    };
  }
};
