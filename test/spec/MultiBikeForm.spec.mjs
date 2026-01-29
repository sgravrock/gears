import {config, MultiBikeForm} from "../../app.mjs";
import { render } from 'preact';
import { useState } from 'preact/hooks';
import { html } from 'htm/preact';
import { act } from 'preact/test-utils';

describe('MultiBikeForm', function() {
	it('allows forms to be added and removed', function() {
		const root = document.createElement('div');
		render(html`<${TestFormStateContainer}/>`, root);

		act(function() {
			findByText(root, 'button', 'Add Bike').click();
		});
		expect(root.querySelectorAll('form').length).toEqual(2);

		act(function() {
			findByText(root, 'button', 'Add Bike').click();
		});
		expect(root.querySelectorAll('form').length).toEqual(3);

		changeField(root.querySelectorAll('[name=chainring]')[1], '24');

		act(function() {
			findByText(root, 'button', 'Remove').click();
		});

		expect(root.querySelectorAll('form').length).toEqual(2);
		expect(root.querySelectorAll('[name=chainring]')[0].value)
			.toEqual('24');
	});

	it('does not allow removing the only form', function() {
		const root = document.createElement('div');
		render(html`<${TestFormStateContainer}/>`, root);
		expect(findByText(root, 'button', 'Remove')).toBeFalsy();

		act(function() {
			findByText(root, 'button', 'Add Bike').click();
		});

		act(function() {
			findByText(root, 'button', 'Remove').click();
		});
		expect(findByText(root, 'button', 'Remove')).toBeFalsy();
	})

	describe('An individual form', function() {
		it('does not initially display a result', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			expect(root.querySelector('.result').textContent).toEqual('');
		});

		it('displays gear inches when all inputs are valid', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			selectOption(root.querySelector('[name="wheelSize"]'), '26 x 1.5"');
			changeField(root.querySelector('[name=chainring]'), '42');
			changeField(root.querySelector('[name=cog]'), '24');

			expect(root.querySelector('.result').textContent)
				.toEqual('43.5225 inches');
		});
	});

	function TestFormStateContainer() {
		const initialBikes = [{id: 1, wheelSize: config.wheels[0].diameterIn}];
		const [bikes, setBikes] = useState(initialBikes);
		return html`<${MultiBikeForm} bikes=${bikes} setBikes=${setBikes}/>`;
	}

	function findByText(root, selector, text) {
		const candidates = root.querySelectorAll(selector);

		for (const candidate of candidates) {
			if (candidate.textContent === text) {
				return candidate;
			}
		}
	}

	function changeField(field, newValue) {
		act(function() {
			field.value = newValue;
			field.dispatchEvent(new Event('change'));
		});
	}

	function selectOption(selectEl, optionText) {
		for (let i = 0; i < selectEl.options.length; i++) {
			if (selectEl.options[i].textContent === optionText) {
				act(function() {
					selectEl.selectedIndex = i;
					selectEl.dispatchEvent(new Event('change'));
				});
				return;
			}
		}

		throw new Error("Couldn't find requested option");
	}
});