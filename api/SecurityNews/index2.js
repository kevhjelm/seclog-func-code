const axios = require("axios");

module.exports = async function (context, req) {
    context.log("Function starting...");
    context.log("NEWSAPI_KEY present:", !!process.env.NEWSAPI_KEY);
    context.log("Query param q:", req.query.q);

    try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: req.query.q || "cybersecurity",
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
