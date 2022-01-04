import * as React from 'react';
import {CustomDashboardInsightComponent} from '@gooddata/sdk-ui-dashboard';
import {useInsightWidgetDataView} from './utils/useInsightWidgetDataView';
import {ErrorComponent, LoadingComponent} from '@gooddata/sdk-ui';
import {drillToDashboard} from '@gooddata/sdk-ui-dashboard';
import './customTable.css';

const getPercentage = (items: Array<string | number | null>): number[] => {
	const numbers: number[] = items.map(item => typeof item === 'string' ? parseInt(item, 10) : (item ?? 0));
	const total = numbers.reduce((a, b) => a + b, 0);

	return numbers.map(number => number / total * 100);
};

const StatusPieRender: React.FC<{status: Array<number | string | null>}> = ({status: [success, error, skip]}) => {
	const [successPercent, errorPercent, skipPercent] = React.useMemo(() => getPercentage([success, error, skip]), [success, error, skip]);

	return <svg height="25px" viewBox="0 0 42 42">
		<circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgb(0, 193, 141)" strokeWidth="8" strokeDasharray={`${successPercent} ${100 - successPercent}`} strokeDashoffset="25"/>
		<circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgb(229, 77, 66)" strokeWidth="8" strokeDasharray={`${errorPercent} ${100 - errorPercent}`} strokeDashoffset={125 - successPercent} />
		<circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgb(244, 213, 33)" strokeWidth="8" strokeDasharray={`${skipPercent} ${100 - skipPercent}`} strokeDashoffset={125 - successPercent - errorPercent} />
	</svg>;
};

const processRefs = (refs: string): string => {
	return refs.split(/, ?/).map(ref => ref.replace('HEAD -> ', '')).join(', ');
};

export const CustomTable: CustomDashboardInsightComponent = ({widget}) => {
	const {result, error, status} = useInsightWidgetDataView({insightWidget: widget});

	const res = React.useMemo(() => result?.data().slices().toArray().map(slice => {
		const [execId, date, commit, refs] = slice.sliceTitles(); // [Execution ID, date, commit, refs]
		const [duration, ...status] = slice.rawData();

		return {
			status,
			duration,
			id: execId,
			date,
			commit,
			refs,
		};
	}), [result]);

	if (status === 'loading' || status === 'pending' || !res)
		return <LoadingComponent />;

	if (status === 'error')
		return <ErrorComponent message={error?.getMessage()} code={error?.getErrorCode()} />;

	const drill = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const drillDefinition = {
			type: 'drillToDashboard',
			transition: 'in-place',
			origin: {
				type: 'drillFromAttribute',
				attribute: {identifier: 'label.execution.executionid'},
			},
			target: {identifier: 'aaGSf1QXPkM4'},
		} as const;
		const drill = drillToDashboard(drillDefinition, {
			drillDefinitions: [drillDefinition],
			dataView: result!.dataView,
			drillContext: {
				type: 'table',
				element: 'cell',
			},
		});

		console.log(drill);
	};

	return <div className="wrap">
		{res.map(execution => {
			return <div key={execution.id} className="row">
				<div className="status" title={`Passed: ${execution.status[0]}, failed: ${execution.status[1]}, skipped: ${execution.status[2]}`}>
					<StatusPieRender status={execution.status} />
				</div>
				<div className="titleCell">
					<a className="link" href="" onClick={drill}>Execution {execution.id}</a>
				</div>
				<div className="cell">
					<div className="primary">{execution.date}</div>
					<div className="secondary">Duration: {execution.duration}s</div>
				</div>
				<div className="cell">
					<div className="primary">{execution.commit}</div>
					<div className="secondary">Refs: {processRefs(execution.refs)}</div>
				</div>
			</div>;
		})}
	</div>
};
