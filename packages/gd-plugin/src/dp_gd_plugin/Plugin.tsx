// (C) 2021 GoodData Corporation
import {
	DashboardContext,
	DashboardPluginV1,
	IDashboardCustomizer,
	IDashboardEventHandling,
} from '@gooddata/sdk-ui-dashboard';
import packageJson from '../../package.json';
import {CustomTable} from './CustomTable';
import {Details} from './Details';

export class Plugin extends DashboardPluginV1 {
	public readonly author = packageJson.author;
	public readonly displayName = packageJson.name;
	public readonly version = packageJson.version;

	public register(
		_ctx: DashboardContext,
		customize: IDashboardCustomizer,
		_handlers: IDashboardEventHandling,
	): void {
		customize.insightWidgets().withCustomProvider((_insight, widget) => {
			// TODO: selecting by title is not the best approach, as title can be easily changed in UI
			switch (widget.title) {
				case 'Executions list':
					return CustomTable;
				case 'Execution overview':
				case 'Test Suite details':
					return Details;
				default:
					return undefined;
			}
		});
	}
}
