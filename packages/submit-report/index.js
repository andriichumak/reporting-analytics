const util = require('util');
const {program} = require('commander');
const glob = util.promisify(require('glob'));
const fetch = require('node-fetch');
const git = require('simple-git')();
const path = require('path');
const {FormData} = require('formdata-node');
const {fileFromPath} = require('formdata-node/file-from-path');
const {FormDataEncoder} = require('form-data-encoder');
const {Readable} = require('stream');

// Parse input parameters
program.option('-p, --path <filePath>', 'Path to jUnit report(s). Accepts Glob pattern.', './reports/**/*.xml');
program.option('-v, --version <appVersion>', 'Application version that is being tested.', 'v0.0.1');
program.option('-h, --host <serverUrl>', 'A URL of the reporting server', 'http://localhost:3000');
program.parse(process.argv);
const options = program.opts();

const main = async () => {
	// Gather a list of files
	const files = await glob(options.path, {nodir: true, absolute: true});

	if (!files.length) {
		throw new Error(`No files found to report at ${options.path}`);
	}

	// Gather git info
	const [commit, commitTimestamp, refs] = (await Promise.all([
		git.show(['--format=%H', '-s']),
		git.show(['--format=%ct', '-s']),
		git.show(['--format=%D', '-s']),
	])).map(result => result.trim());

	console.log('Submitting jUnit reports.');
	console.log(`Server host:   ${options.host}`);
	console.log(`App version:   ${options.version}`);
	console.log(`Git commit:    ${commit}`);
	console.log(`Git timestamp: ${commitTimestamp}`);
	console.log(`Git refs:      ${refs}`);
	console.log('Files:');
	files.forEach(file => {
		console.log(`- ${file}`);
	});

	// Build a FormData to submit to server
	const data = new FormData();

	// Add metadata
	data.set('meta', JSON.stringify({
		git: {
			commit: commit.trim(),
			commitTimestamp: commitTimestamp ? (new Date(parseInt(commitTimestamp.trim(), 10) * 1000)).getTime() : Date.now(),
			refs: refs.trim(),
		},
		appVersion: options.version,
	}));

	// Add all jUnit files
	await Promise.all(files.map(async file => {
		data.append('report', await fileFromPath(file), path.basename(file));
	}));

	// Submit the form data
	const encoder = new FormDataEncoder(data);
	const res = await fetch(options.host, {
		method: 'POST',
		headers: encoder.headers,
		body: Readable.from(encoder)
	});

	if (!res.ok) {
		let message = '';
		try {
			message = (await res.json()).message;
		} catch (e) {
		}
		throw new Error(`Failed to submit reports to server: ${res.status} - ${res.statusText}\n\n${message}`);
	}

	const responseMessage = await res.json();

	console.log(`Reports submitted: ${responseMessage.message}`);
};

main().catch(error => {
	console.error(error);
	process.exit(1);
});
