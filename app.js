var createError = require('http-errors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var sassMiddleware = require('node-sass-middleware')
var hbs = require('hbs')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

module.exports = ({ express, app, io }) => {
	const { Router } = express

	// view engine setup
	hbs.registerPartials(__dirname + '/views/partials')
	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'hbs')

	// express routes
	app.use(logger('dev'))
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))
	app.use(cookieParser())
	app.use(
		sassMiddleware({
			src: path.join(__dirname, 'resources', 'scss'),
			dest: path.join(__dirname, 'public', 'css'),
			prefix: '/css',
			indentedSyntax: false, // true = .sass and false = .scss
			sourceMap: true
		})
	)
	app.use(express.static(path.join(__dirname, 'public')))

	app.use('/', indexRouter)
	app.use('/users', usersRouter)
	app.use('/women', require('./routes/io-women')({ Router, io }))
	app.use('/girls', require('./routes/io-girls')({ Router, io }))

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(404))
	})

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'development' ? err : {}

		// render the error page
		res.status(err.status || 500)
		res.render('error')
	})

	io.on('connection', socket => {
		console.log('Socket Connect:', { id: socket.id })
		socket.on('disconnect', message => {
			console.log({ id: socket.id, message })
		})

		socket.on('women-message', msg => {
			console.log('women-message:', msg)
			io.emit('women-message', { id: socket.id, message: msg })
		})

		socket.on('girls-message', msg => {
			console.log('girls-message:', msg)
			io.emit('girls-message', { id: socket.id, message: msg })
		})
	})

	return app
}
