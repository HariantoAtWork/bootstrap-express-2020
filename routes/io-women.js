module.exports = ({ Router, io }) => {
	const router = Router()
	/* GET users listing. */
	router
		.get('/', function (req, res, next) {
			res.render('women', { title: 'Women Page' })
		})
		.post('/', (req, res) => {
			io.emit('women-message', { ...req.body, id: 'women' })
			res.json(req.body)
		})

	return router
}
