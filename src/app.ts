'use strict'
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
const app = express()

app.set('view engine', 'pug')
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', (req, res) => {
  const apiGateway = (req as any).apiGateway;
  res.render('index', {
    apiUrl: apiGateway ? `https://${apiGateway.event.headers.Host}/${apiGateway.event.requestContext.stage}` : 'http://localhost:3000'
  })
})

app.get('/sam', (req, res) => {
  res.sendFile(`${__dirname}/sam-logo.png`)
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.get('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) return res.status(404).json({})

  return res.json(user)
})

app.post('/users', (req, res) => {
  const user = {
    id: ++userIdCounter,
    name: req.body.name
  }
  users.push(user)
  res.status(201).json(user)
})

app.put('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) return res.status(404).json({})

  user.name = req.body.name
  res.json(user)
})

app.delete('/users/:userId', (req, res) => {
  const userIndex = getUserIndex(req.params.userId)

  if(userIndex === -1) return res.status(404).json({})

  users.splice(userIndex, 1)
  res.json(users)
})

const getUser = (userId: string) => users.find(u => u.id === parseInt(userId))
const getUserIndex = (userId: string) => users.findIndex(u => u.id === parseInt(userId))

// Ephemeral in-memory data store
const users = [{
  id: 1,
  name: 'Joe'
}, {
  id: 2,
  name: 'Jane'
}]
let userIdCounter = users.length

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)

// Export your express server so you can import it in the lambda function.
export = app
