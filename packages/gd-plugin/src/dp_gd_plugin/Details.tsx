import React from 'react';
import {useInsightWidgetDataView} from './utils/useInsightWidgetDataView';
import {ErrorComponent, LoadingComponent} from '@gooddata/sdk-ui';
import {CustomDashboardInsightComponent} from '@gooddata/sdk-ui-dashboard';
import './details.css';

export const Details: CustomDashboardInsightComponent = ({widget}) => {
	const {result, error, status} = useInsightWidgetDataView({insightWidget: widget});

	const res = React.useMemo<Array<{header: string, value: string}>[]>(() => {
		const headers: string[] = result?.meta().attributeDescriptors().map(descriptor => descriptor.attributeHeader.formOf.name) ?? [];

		return result?.data().slices().toArray().map(slice => {
			const sliceTitles = slice.sliceTitles();

			return headers.map((header, i) => ({
				header,
				value: sliceTitles[i] ?? '',
			}));
		}) ?? [];
	}, [result]);

	if (status === 'loading' || status === 'pending' || !res)
		return <LoadingComponent />;

	if (status === 'error')
		return <ErrorComponent message={error?.getMessage()} code={error?.getErrorCode()} />;

	return <dl className="details-list">
		{res[0].map(cell => {
			return <>
				<dt>{cell.header}</dt>
				<dd>{cell.value}</dd>
			</>
		})}
	</dl>;
};
