const axios = require("axios");

module.exports = async function (context, req) {
    const query = req.query.q;

    // No query param → show search page
    if (!query) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>News Search</title>
            </head>
            <body style="font-family: Arial; text-align: center; margin-top: 50px;">
                <h1>Search News</h1>
                <form method="GET" action="">
                    <input type="text" name="q" placeholder="Enter search term" style="padding: 8px; width: 250px;">
                    <button type="submit" style="padding: 8px;">Search</button>
                </form>
            </body>
            </html>
        `;

        context.res = {
            status: 200,
            headers: { "Content-Type": "text/html" },
            body: html
        };
        return;
    }

    // Query provided → fetch news
    try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: query,
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
