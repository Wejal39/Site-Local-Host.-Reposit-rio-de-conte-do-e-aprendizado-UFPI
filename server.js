const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos estáticos do diretório 'public'

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database(':memory:'); // Use um banco de dados em memória para simplicidade

// Criar tabela de conteúdos
db.serialize(() => {
    db.run(`
        CREATE TABLE conteudos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT,
            materia TEXT,
            metodo TEXT,
            topicos TEXT,
            anotacoes TEXT,
            resumo TEXT,
            conceitos TEXT,
            explicacao TEXT,
            lacunas TEXT,
            simplificacao TEXT,
            imagem TEXT
        )
    `);
});

// Rota para adicionar conteúdo
app.post('/api/conteudos', (req, res) => {
    const { data, materia, metodo, topicos, anotacoes, resumo, conceitos, explicacao, lacunas, simplificacao, imagem } = req.body;
    db.run(`
        INSERT INTO conteudos (data, materia, metodo, topicos, anotacoes, resumo, conceitos, explicacao, lacunas, simplificacao, imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [data, materia, metodo, topicos, anotacoes, resumo, conceitos, explicacao, lacunas, simplificacao, imagem], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Rota para obter conteúdos
app.get('/api/conteudos', (req, res) => {
    const { data, materia, metodo } = req.query;
    let query = 'SELECT * FROM conteudos WHERE 1=1';
    const params = [];
    if (data) {
        query += ' AND data = ?';
        params.push(data);
    }
    if (materia) {
        query += ' AND materia LIKE ?';
        params.push(`%${materia}%`);
    }
    if (metodo) {
        query += ' AND metodo = ?';
        params.push(metodo);
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
