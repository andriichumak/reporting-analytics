describe('GoodData website', () => {
	it('should have a correct title', async () => {
		await browser.url(`https://gooddata.com`);

		await expect($('title')).toHaveTextContaining('Leader in Data as a Service');
	});

	it('should include "Get a demo" button', async () => {
		await browser.url('https://gooddata.com');

		await expect($('#main-menu-request-a-demo')).toHaveTextContaining('Get a demo');
	});

	it('should include a webinar banner', async () => {
		await browser.url('https://gooddata.com');

		await expect($('.c-banner-promo')).toExist();
	});
});

