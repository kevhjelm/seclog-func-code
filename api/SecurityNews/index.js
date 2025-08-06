const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async function (context, req) {
    const query = req.query.q;

    // If no query param => return the HTML search page
    if (!query) {
        const htmlPath = path.join(__dirname, "../../index.html"); // index.html in root
        const html = fs.readFileSync(htmlPath, "utf8");

        context.res = {
            status: 200,
            headers: { "Content-Type": "text/html" },
            body: html
        };
        return;
    }

    // Otherwise => perform API request
    context.log("Function starting...");
    context.log("NEWSAPI_KEY present:", !!process.env.NEWSAPI_KEY);
    context.log("Query param q:", query);

    try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: query || "cybersecurity",
                sortBy: "publishedAt",
                pageSize: 10,
                apiKey: process.env.NEWSAPI_KEY
            }
        });

        const articles = response.data.articles.map(article => ({
            title: article.title,
            url: article.url,
            description: article.description,
            publishedAt: article.publishedAt,
            source: article.source.name
        }));

        context.res = {
            status: 200,
            body: articles
        };
    } catch (error) {
        context.log("Error:", error);
        context.res = {
            status: 500,
            body: error.message
        };
    }
};
