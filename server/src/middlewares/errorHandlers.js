const notFound = (req, res, next) => {
  res.status(404)
  const error = new Erorr('Not found!')
  next(error)
}

const errorHandler = (err, req, res, next) => {
  res.json({
    err: err.message,
    stack: process.env.NODE_ENV === 'production' ? "" : err.stack
  })
}

module.exports = {
  notFound,
  errorHandler
}