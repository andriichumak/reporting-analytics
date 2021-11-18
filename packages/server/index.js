const express = require('express');
const os = require('os');
const formData = require('express-form-data');
const app = express();
const port = 3000;
const fs = require('fs/promises');
const {parseReports} = require('./parseJUnit');
const {submitExecution} = require('./sql');

app.use(formData.parse({
	uploadDir: os.tmpdir(),
	autoClean: true
}));

app.post('/', async (req, res) => {
	try {
		const meta = JSON.parse(req.body?.meta);
		const xmlReports = await Promise.all(req.files?.report?.map(fileStream => {
			return fs.readFile(fileStream.path, 'utf8');
		}) ?? []);

		const jsonReports = await parseReports(xmlReports);

		await submitExecution(meta, jsonReports);
	} catch (e) {
		console.error(e);
		res.status(400).json({
			message: e.message,
			status: 'error',
		});

		return;
	}

	res.json({
		message: 'Received',
		status: 'success',
	});
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
});
