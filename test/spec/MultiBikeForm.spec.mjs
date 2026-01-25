import {MultiBikeForm} from "../../app.mjs";
import { render } from 'preact';
import { html } from 'htm/preact';

describe('MultiBikeForm', function() {
	it('initially shows one form', function() {
		const root = document.createElement('div');
		render(html`<${MultiBikeForm}/>`, root);

		expect(root.querySelectorAll('form').length).toEqual(1);
	});

	it('allows forms to be added and removed', async function() {
		const root = document.createElement('div');
		render(html`<${MultiBikeForm}/>`, root);

		findByText(root, 'button', 'Add Bike').click();
		await null;
		expect(root.querySelectorAll('form').length).toEqual(2);

		findByText(root, 'button', 'Add Bike').click();
		await null;
		expect(root.querySelectorAll('form').length).toEqual(3);

		changeField(root.querySelectorAll('[name=chainringTeeth]')[1], '24');
		await null;

		findByText(root, 'button', 'Remove').click();
		await null;
		expect(root.querySelectorAll('form').length).toEqual(2);
		expect(root.querySelectorAll('[name=chainringTeeth]')[0].value)
			.toEqual('24');
	});

	function findByText(root, selector, text) {
		const candidates = root.querySelectorAll(selector);

		for (const candidate of candidates) {
			if (candidate.textContent === text) {
				return candidate;
			}
		}

		throw new Error(`Not found: ${selector} with text "${text}"`);
	}

	// TODO de-dupe
	function changeField(field, newValue) {
		field.value = newValue;
		field.dispatchEvent(new Event('change'));
	}
});