const express = require("express");
const knex = require("knex");
const knexConfig = require("./knexfile.js");

const db = knex(knexConfig.development);

const helmet = require("helmet");

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/api/zoos', async(req, res) => {

    try {
        const zoos = await db('zoos'); // all the records from the zoos table
        res.status(200).json(zoos);
    } catch (error) {
        res.status(500).json({ error, message: 'COuldnt retrieve data' });
    }
});

server.get('/api/zoos/:id', (req, res) => {
    db('zoos')
        .where({ id: req.params.id })
        .first()
        .then(zoo => {
            if (zoo) {
                res.status(200).json(zoo)
            } else {
                res.status(404).json({ message: 'Zoo not found' })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})



server.post('/api/zoos/', (req, res) => {
    db('zoos')
        .insert(req.body)
        .then(ids => {
            db('zoos')
                .where({ id: ids[0] })
                .first()
                .then(animal => {
                    res.status(200).json(animal)
                })
        })
        .catch(err => {
            res.status(500).json({ err, message: 'Problem posting dudes' })
        })
})

server.put('/api/zoos/:id', (req, res) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).json({ message: 'provide ids' })
    } else {
        db('zoos')
            .where({ id: id }).update(req.body)
            .then(count => {
                if (count > 0) {
                    res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} Updated` })
                } else {
                    res.status(404).json({ message: "Animal doesn't exist" })
                }
            })
            .catch(err => {
                res.status(500).json({ err, message: 'PROBLEMS' })
            })
    }
})


server.delete('/api/zoos/:id', (req, res) => {
    if (!req.params.id)
        res.status(404).json({ message: 'Provide id' })
    else
        db('zoos')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} Deleted` })
            } else {
                res.status(404).json({ message: 'Record doesnt exist' })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

//ommcmcmcmm
const port = 3300;
server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});