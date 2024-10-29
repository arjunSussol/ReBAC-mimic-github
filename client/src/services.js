import axios from "axios"

const resourceUrl = '/api/resources'

const getResources = () => {
    return axios.get(resourceUrl)
        .then(response => response.data)
}

export default { getResources }