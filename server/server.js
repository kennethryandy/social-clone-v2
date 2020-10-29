const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const GridFsStorage = require('multer-gridfs-storage')
const multer = require('multer')
const path = require('path')
const Pusher = require('pusher')

const port = process.env.PORT || 5000

const app = express()
//midlewares
app.use(express.json())
app.use(cors())

Grid.mongo = mongoose.mongo

app.get('/', (req, res) => {
  res.status(200).json({message: 'hello'})
})

//mongodb config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

console.log(process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Database connected'))
.catch(err => console.log(err))

//routes


//error handler middleware
const errorHandler = require('./src/middlewares/errorHandlers')

app.use(errorHandler.notFound)
app.use(errorHandler.errorHandler)

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))