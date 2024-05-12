import { useState, useEffect } from 'react'
import contactService from './services/contacts'


const notificationStyle = {
  color: 'green',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5
}


const Notification = ({message, color}) => {
  if (message === null) {
    return null
  }
  else {
    return (
      <div style={{...notificationStyle, color: color}}><p>{message}</p></div>
    )
  }
}


const Filter = ({value, handleChange}) => (
  <div>Filter <input value={value} onChange={handleChange}/></div>
)


const PersonForm = ({handleSubmit, handleNameChange, handleNumberChange, name, number}) => (
  <>
    <form onSubmit={handleSubmit}>
      <div>name: <input value={name} onChange={handleNameChange}/></div>
      <div>number: <input value={number} onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
)

const Contact = ({person, handleErase}) => (
    <div>
      <p style={{display: 'inline'}}>{person.name} {person.number}</p>
      <button onClick={() => { 
        if (window.confirm(`Delete ${person.name}?`)) {
          handleErase(person.id)
        }
      }}>delete</button>
    </div>
)

const Contacts = ({persons, handleErase}) => (
  <>
    {persons.map((person) =>  (
          <Contact key={person.name} person={person} handleErase={handleErase} />
      )
    )}
  </>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  useEffect(() => {
    contactService
      .getAll()
      .then(contacts => setPersons(contacts))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const contact = {name: newName, number: newNumber}

    if (!persons.map((p) => p.name).includes(newName)) {
      contactService
        .create(contact)
        .then(contact => {
          setPersons(persons.concat(contact))
          showNotification(`Created contact ${contact.name}`)
        })
    }
    else {
      if (window.confirm(`Are you sure you want to modify ${contact.name}`)) {
        contact.id = persons.find(p => p.name === contact.name).id
        contactService
          .update(contact)
          .then(contact =>  {
            setPersons(persons.map(p => p.name !== contact.name ? p : contact))
            showNotification(`Updated contact ${contact.name}`)
          })
          .catch(error => {
            setPersons(persons.filter(p => p.name !== contact.name))
            showNotification(`Contact ${contact.name} has been removed from the server ${error}`, false)
          })
      }
    }

    setNewName('')
    setNewNumber('')
  }

  const updateName = (event) => {
    setNewName(event.target.value)
  }

  const updateNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const updateFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleErase = (id) => {
    contactService
      .erase(id)
      .then(data => {
        setPersons(persons.filter(p => p.id !== id))
        showNotification(`Deleted ${persons.find((p) => p.id === id).name}`)
      })
  }

  const filterPersons = () => {
    return persons.filter((person) => person.name.toLowerCase().startsWith(filter.toLowerCase()))
  }

  const showNotification = (message, good=true) => {
    setNotification(message);
    setNotificationColor(good ? 'green' : 'red')
    setTimeout(() => setNotification(null), 5000);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} color={notificationColor} />
      <Filter value={filter} handleChange={updateFilter} />

      <h2>Add new contact</h2>
      <PersonForm 
        handleSubmit={addPerson} 
        handleNameChange={updateName} 
        handleNumberChange={updateNumber}
        name={newName}
        number={newNumber}
      />

      <h2>Contacts</h2>
      <Contacts persons={filterPersons()} handleErase={handleErase} />
    </div>
  )

}

export default App