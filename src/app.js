const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setting up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

//for views, using render and not send
//no need to include the file extension in the argument
app.get('', (req, res) => {
    res.render('index', {
        title: 'WeatherApp',
        name: 'Matthew K'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Matthew K'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'Please help yourself',
        name: 'Matthew K'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address! Try another search'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404 Error',
        errorMessage: 'Help page not found',
        name: 'Matthew Kevork'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        errorMessage: 'Page not found',
        name: 'Matthew Kevork'
    })})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})