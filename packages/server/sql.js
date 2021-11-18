const {Client} = require('pg');

exports.submitExecution = async (meta, reports) => {
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'qa',
		password: '',
		port: 5432,
	});

	await client.connect();

	try {
		await client.query('BEGIN');

		const execution = await client.query('INSERT INTO execution(git_commit, git_commit_datetime, git_refs, app_version) VALUES($1, $2, $3, $4) RETURNING *', [
			meta.git?.commit ?? null,
			meta.git?.commitTimestamp ? new Date(meta.git.commitTimestamp) : null,
			meta.git?.refs ?? null,
			meta.appVersion ?? null,
		]);

		for (const reportDefinition of reports) {
			const report = await client.query('INSERT INTO report(name, capabilities, file, spec_id, start_time, duration, execution) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
				reportDefinition.name,
				reportDefinition.capabilities,
				reportDefinition.file,
				reportDefinition.specId,
				new Date(reportDefinition.startTime),
				reportDefinition.duration,
				execution.rows[0].id,
			]);

			for (const testCaseRunDefinition of reportDefinition.testCases) {
				await client.query('INSERT INTO test_case_run(class_name, name, duration, system_out, system_err, status, message, report) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [
					testCaseRunDefinition.className,
					testCaseRunDefinition.name,
					testCaseRunDefinition.duration,
					testCaseRunDefinition.systemOut,
					testCaseRunDefinition.systemErr,
					testCaseRunDefinition.status,
					testCaseRunDefinition.message,
					report.rows[0].id,
				]);
			}
		}

		await client.query('COMMIT');
	} catch (e) {
		await client.query('ROLLBACK');

		throw e;
	} finally {
		await client.end();
	}
};
