require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(bodyParser.json())
app.use(express.static("build"))
app.use(cors())

morgan.token("body", function (req) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(Person.format))
  })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.get("/info", (req, res) => {
  Person.countDocuments({}, function(err, count) {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${count} people</p>
        <p>${date}</p>`)
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" })
  }

  const value = body.number

  let parts = value.split("-")

  if (parts.length !== 2) {
    return res.status(400).json({ error: "Phone number must have exactly two parts separated by a hyphen" })
  }
  if ([2, 3].indexOf(parts[0].length) === -1) {
    return res.status(400).json({ error: "First part of the phone number must have 2 or 3 digits" })
  }
  if (parts[1].length < 4) {
    return res.status(400).json({ error: "Second part of the phone number must have at least 4 digits" })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }
  
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
