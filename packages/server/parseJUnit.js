const util = require('util');
const xml2js = require('xml2js');
const parseString = util.promisify(xml2js.parseString);

const parseReports = async reports =>
	(await Promise.all(reports.map(report => parseString(report, {normalize: true}))))
		.reduce((acc, item) => acc.concat(item?.testsuites?.testsuite ?? []), [])
		.map(normalizeTestSuite);

const getNormalizedProps = testSuite => {
	if (!testSuite?.properties?.[0]?.property?.length) {
		return {};
	}

	return testSuite.properties[0].property.reduce((acc, item) => {
		if (item.$?.name && item.$?.value) {
			acc[item.$.name] = item.$.value;
		}

		return acc;
	}, {});
};

const getNormalizedStatus = testCase => {
	if (testCase.skipped) {
		return {status: 'skipped', message: null};
	}

	if (testCase.failure || testCase.error) {
		const out = {status: 'failed'};

		out.message = [
			testCase.failure?.map(failure => typeof failure === 'string' ? failure : [
				failure._ ?? false,
				failure.$?.message ?? false,
			].filter(Boolean).join('\n')),
			testCase.error?.map(error => typeof error === 'string' ? error : [
				error._ ?? false,
				error.$?.message ?? false,
			].filter(Boolean).join('\n')),
		].filter(Boolean).join('\n');

		return out;
	}

	return {status: 'passed', message: null};
};

const normalizeTestSuite = testSuite => {
	if (!testSuite)
		return undefined;

	const props = getNormalizedProps(testSuite);
	const $ = testSuite.$ ?? {};

	return {
		specId: props.specId || null,
		name: $.name || props.suiteName || '',
		capabilities: props.capabilities || null,
		file: props.file || null,
		startTime: $.timestamp ? (new Date($.timestamp)).getTime() : Date.now(),
		duration: Number.isNaN(parseFloat($.time)) ? null : parseFloat($.time),
		testCases: (testSuite.testcase ?? []).map(testCase => {
			const $$ = testCase.$ ?? {};

			return {
				className: $$.classname || null,
				name: $$.name || null,
				duration: Number.isNaN(parseFloat($$.time)) ? null : parseFloat($$.time),
				systemOut: (testCase['system-out'] ?? []).join('\n\n'),
				systemErr: (testCase['system-err'] ?? []).join('\n\n'),
				...getNormalizedStatus(testCase),
			};
		}),
	};
};

module.exports = {parseReports};
