const express = require('express');
const app = express();

app.get('/manifest.json', (req, res) => {
    res.json({
        id: "teste-addon",
        version: "1.0.0",
        name: "Addon Teste",
        resources: ["catalog"],
        types: ["movie"],
        catalogs: [
            { type: "movie", id: "teste", name: "Teste Filmes" }
        ]
    });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
