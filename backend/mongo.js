const mongoose = require('mongoose')




const initdb = () => {
    mongoose.set('strictQuery', false)

    passwd = process.argv[2]
    url = `mongodb+srv://vaige:${passwd}@cluster0.z3v7bfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

    mongoose.connect(url)
        .then(result => {
            console.log('Connected to MongoDB')
        })
        .catch(error => {
            console.error('Failed to connect MongoDB', error.message)
        })

    const contactSchema = new mongoose.Schema({
        name: String,
        number: String
    })


    contactSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    return mongoose.model('Contact', contactSchema)
}

try {
    const Contact = initdb()

    if (process.argv.length === 3) {
        Contact.find({})
            .then(results => {
                console.log('phonebook')
                results.forEach((result) => {
                    console.log(`${result.name} ${result.number}`)
                })
            })
            .finally(() => mongoose.connection.close())
    }
    else if (process.argv.length === 5) {
        const contact = new Contact({
            name: process.argv[3],
            number: process.argv[4]
        })

        contact.save()
            .then(c => console.log(`added ${c.name} number ${c.number} to phonebook`))
            .finally(() => mongoose.connection.close())
    }
    else {
        console.error('Unknown number of arguments')
        mongoose.connection.close()
    }
} catch (error) {
    console.log(error)
    stop()
}