describe('Google website', () => {
	it('should have a correct title', async () => {
		await browser.url(`https://www.google.com/`);

		if (await $('#L2AGLb').isClickable()) {
			await $('#L2AGLb').click();
		}

		expect($('title')).toHaveTextContaining('Google');
	});

	it('should have search field', async () => {
		await browser.url(`https://www.google.com/`);

		if (await $('#L2AGLb').isClickable()) {
			await $('#L2AGLb').click();
		}

		expect($('form[role=search] input')).toExist();
	});

	it('should find GoodData website', async () => {
		await browser.url(`https://www.google.com/`);

		if (await $('#L2AGLb').isClickable()) {
			await $('#L2AGLb').click();
		}

		await $('form[role=search] input').setValue('GoodData');
		await browser.keys(['Enter']);

		expect($('#rso')).toHaveTextContaining('https://gooddata.com');
	});
});
