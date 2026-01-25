import { BikeForm } from '../../app.mjs';
import { render } from 'preact';
import { html } from 'htm/preact';

describe('BikeForm', function() {
	it('does not initially display a result', function() {
		const root = document.createElement('div');
		render(html`<${BikeForm}/>`, root);

		expect(root.querySelector('.result').textContent).toEqual('');
	});
	
	it('displays gear inches when all inputs are valid', async function() {
		const root = document.createElement('div');
		render(html`<${BikeForm}/>`, root);

		selectOption(root.querySelector('[name="wheelSize"]'), '26 x 1.5"');
		changeField(root.querySelector('[name=chainringTeeth]'), '42');
		changeField(root.querySelector('[name=cogTeeth]'), '24');
		await null;
		console.log('did last change, asserting');

		expect(root.querySelector('.result').textContent)
			.toEqual('43.5225 inches');
		console.log('asserted');

	});

	function changeField(field, newValue) {
		field.value = newValue;
		field.dispatchEvent(new Event('change'));
	}

	function selectOption(selectEl, optionText) {
		for (let i = 0; i < selectEl.options.length; i++) {
			if (selectEl.options[i].textContent === optionText) {
				selectEl.selectedIndex = i;
				selectEl.dispatchEvent(new Event('change'));
				return;
			}
		}

		throw new Error("Couldn't find requested option");
	}
});
