const axios = require('axios')

module.exports = {
    myGet(url, params = {}, headers = {}) {
        return new Promise((resolve, reject) => {
            axios
                .get(url, {
                    params: params,
                    ...headers
                })
                .then((res) => {
                    resolve(res);
                    ``
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    myPost(url, data = {}, headers = {}) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, data, headers)
                .then((res) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}