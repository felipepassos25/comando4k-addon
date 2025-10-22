const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Manifesto do addon
app.get('/manifest.json', (req, res) => {
    res.json({
        id: "comando4k-addon",
        version: "1.0.0",
        name: "Comando 4K Filmes Dublados",
        resources: ["catalog", "meta", "stream"],
        types: ["movie"],
        catalogs: [
            { type: "movie", id: "comando4k", name: "Filmes 4K Comando" }
        ]
    });
});

// Catalog endpoint
app.get('/catalog/:type/:id', async (req, res) => {
    try {
        const url = 'https://comando4kfilmes.xyz/6'; // Seção 4K do site
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let movies = [];
        $('.movie-item').each((i, el) => {
            const relativeLink = $(el).find('a').attr('href');
            const absoluteLink = new URL(relativeLink, 'https://comando4kfilmes.xyz').href;

            const title = $(el).find('h2').text();
            const poster = $(el).find('img').attr('src');

            // Filtra apenas filmes 4K dublados
            if (title.toLowerCase().includes('4k') && title.toLowerCase().includes('dual')) {
                movies.push({
                    id: absoluteLink,
                    name: title,
                    type: 'movie',
                    poster: poster
                });
            }
        });

        res.json({ metas: movies });
    } catch (err) {
        console.error(err);
        res.json({ metas: [] });
    }
});

// Meta endpoint
app.get('/meta/:type/:id', async (req, res) => {
    try {
        const { data } = await axios.get(req.params.id);
        const $ = cheerio.load(data);

        res.json({
            id: req.params.id,
            name: $('.movie-title').text(),
            type: 'movie',
            poster: $('.poster img').attr('src'),
            description: $('.description').text()
        });
    } catch (err) {
        console.error(err);
        res.json({});
    }
});

// Stream endpoint (apenas 4K)
app.get('/stream/:type/:id', async (req, res) => {
    try {
        const { data } = await axios.get(req.params.id);
        const $ = cheerio.load(data);

        let streams = [];
        $('.download-links a').each((i, el) => {
            const linkText = $(el).text();
            if (linkText.toLowerCase().includes('4k')) { // filtra apenas 4K
                streams.push({
                    title: $('.movie-title').text(),
                    url: $(el).attr('href'),
                    quality: '2160p',
                    type: 'movie'
                });
            }
        });

        res.json({ streams });
    } catch (err) {
        console.error(err);
        res.json({ streams: [] });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Addon Comando 4K rodando na porta ${PORT}`));
