const url = require('url')
const express = require('express')
const needle = require('needle')
const apiCache = require('apicache')
const router = express.Router()

//Environment vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE


//Initialize cache
let cache = apiCache.middleware

router.get('/', cache('5 minutes'), async (req, res) => {
    
    try {
        const params = new URLSearchParams({
            [API_KEY_NAME] : API_KEY_VALUE,
            'units':'metric',
            ...url.parse(req.url, true).query
        })

        const apiResponse = await needle('get', `${API_BASE_URL}?${params}`)
        const data = apiResponse.body
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error})
    }
    
})

module.exports = router