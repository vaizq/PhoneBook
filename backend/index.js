const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())


let persons = [
    {id: 1, name: 'Arto hellas', number: '040-123456'},
    {id: 2, name: 'Ada Lovelace', number: '39-33-5323523'},
    {id: 3, name: 'Dan Abramov', number: '12-43-234234'},
    {id: 4, name: 'Mary Poppendick', number: '38-23-6423122'},
]

const getID = () => Math.floor(Math.random() * 10000)


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((p) => p.id == id) 
    if (person) {
        return response.json(person)
    }
    else {
        return response.status(404).end()
    }
}) 

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((p) => p.id !== id)
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body

    console.log('body', body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Missin person information"
        })
    }
    
    const newPerson = {...body, id: getID()}
    persons = persons.filter((p) => p.id === id ? newPerson : p)
    return response.status(201).json(newPerson) 
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const contentErrors = (content) => {
        if (!content.name) {
            return 'Person must have a name';
        }

        if (!content.number) {
            return 'Person must have a number'
        }

        if (persons.find((p) => p.name === content.name)) {
            return 'Person is already in the database';
        }

        return null;
    }

    const errors = contentErrors(body);

    if (errors) {
        return response.status(400).json({
            error: errors
        })
    }

    const person = body

    person.id = getID()
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const now = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p>\n<p>${now.toUTCString()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)