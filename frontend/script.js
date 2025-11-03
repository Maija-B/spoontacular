const form = document.getElementById("form");
const resultsEl = document.getElementById("results");
const recipes = document.getElementById("recipes");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // get all the input values
  const query = document.getElementById("query").value.trim();
  const diet = document.getElementById("diet").value;
  const intolerances = document.getElementById("intolerances").value.trim();
  const maxResults = document.getElementById("maxResults").value;

  // 2) construct the function URL with query params
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (diet) params.append("diet", diet);
  if (intolerances) params.append("intolerances", intolerances);
  params.append("maxResults", maxResults);

  // 3) call Netlify function (which proxies to Spoonacular)
  resultsEl.innerHTML = "<p>Loading…</p>";
  try {
    const resp = await fetch(
      "/.netlify/functions/recipes?" + params.toString()
    );
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Server error: ${text}`);
    }
    const data = await resp.json();

    // 4) Render results
    if (!data.results || data.results.length === 0) {
      resultsEl.innerHTML = "<p>No recipes found.</p>";
      return;
    }
    resultsEl.innerHTML = ""; // clear

    data.results.forEach((recipe) => {
      // Each recipe (we requested addRecipeInformation=true so we should have image and sourceUrl)
      const title = document.createElement("h3");
      title.textContent = recipe.title || "Untitled";
      const info = document.createElement("p");
      info.innerHTML = `Ready in ${recipe.readyInMinutes || "?"} mins • Servings: ${recipe.servings || "?"}
        <br/>
        <a href="${recipe.sourceUrl || "#"}" target="_blank" rel="noopener">View full recipe</a>`;
    });
    recipes.appendChild(title);
    recipes.appendChild(info);
  } catch (err) {
    resultsEl.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    console.error(err);
  }
});
