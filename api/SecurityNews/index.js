context.log("NEWSAPI_KEY:", process.env.NEWSAPI_KEY ? "SET" : "NOT SET");

const axios = require("axios");

module.exports = async function (context, req) {
    const keyword = (req.query.q || (req.body && req.body.q) || "cybersecurity");

    try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: keyword,
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
        context.res = {
            status: 500,
            body: error.message
        };
    }
};


