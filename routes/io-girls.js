module.exports = ({ Router, io }) => {
	const router = Router()
	/* GET users listing. */
	router
		.get('/', function (req, res, next) {
			res.render('girls', { title: 'Girls Page' })
		})
		.post('/', (req, res) => {
			io.emit('girls-message', { ...req.body, id: 'girls' })
			res.json(req.body)
		})

	return router
}
