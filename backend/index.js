require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()


app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())


app.get('/api/persons', (request, response) => {
    Contact.find({}).then(result => {
        response.json(result)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)

    Contact.findById(id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
}) 

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Contact.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error)) 
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const contact = {
        name: body.name,
        number: body.number
    }

    Contact.findByIdAndUpdate(id, contact, { new: true})
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    const contentErrors = (content) => {
        if (!content.name) {
            return 'Person must have a name';
        }

        if (!content.number) {
            return 'Person must have a number'
        }

        /*
        if (persons.find((p) => p.name === content.name)) {
            return 'Person is already in the database';
        }
        */

        return null;
    }

    const errors = contentErrors(person);

    if (errors) {
        return response.status(400).json({
            error: errors
        })
    }

    const contact = new Contact({
        name: person.name,
        number: person.number
    })

    contact.save().then((savedContact) => {
        response.json(savedContact)
    })
})

app.get('/info', (request, response) => {
    Contact.countDocuments({})
        .then(count => {
            const now = new Date()
            response.send(`<p>Phonebook has info for ${count} people</p>\n<p>${now.toUTCString()}</p>`)
        })
})


const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)