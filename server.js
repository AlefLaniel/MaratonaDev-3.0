// configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

// confirgurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '2529',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a tamplate engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano
})

// lista de doadores: Vetor ou Array


// confirgurar a apresentação da página
server.get("/", function(req, res) {

    db.query("SELECT * FROM doadores", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const doadores = result.rows
        return res.render("index.html", { doadores })
    })


})

server.post("/", function(req, res) {
    // pergar dados do formulário
    const nome = req.body.nome
    const email = req.body.email
    const sangue = req.body.sangue

    if (nome == "" || email == "" || sangue == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do banco de dados
    const query = `
    INSERT INTO doadores ("nome", "email", "sangue") 
    VALUES ($1, $2, $3)`

    const values = [nome, email, sangue]

    db.query(query, values, function(err) {
        // fluxo de erros
        if (err) return res.send("erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })


})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor.")
})