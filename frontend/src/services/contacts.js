import axios from 'axios'
const baseUrl = '/api/persons'


const getAll = () => {
    return axios
            .get(baseUrl)
            .then(response => response.data)
}


const create = (contact) => {
    return axios
            .post(baseUrl, contact)
            .then(response => response.data)
}

const erase = (id) => {
    return axios
            .delete(`${baseUrl}/${id}`)
            .then(response => response.data)
}

const update = (contact) => {
    return axios
            .put(`${baseUrl}/${contact.id}`, contact)
            .then(response => response.data)
}

export default { getAll, create, erase, update}