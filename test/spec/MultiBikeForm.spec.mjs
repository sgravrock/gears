import {MultiBikeForm} from "../../app.mjs";
import { render } from 'preact';
import { html } from 'htm/preact';
import { act } from 'preact/test-utils';

describe('MultiBikeForm', function() {
	it('initially shows one form', function() {
		const root = document.createElement('div');
		render(html`<${MultiBikeForm}/>`, root);

		expect(root.querySelectorAll('form').length).toEqual(1);
	});

	it('allows forms to be added and removed', function() {
		const root = document.createElement('div');
		render(html`<${MultiBikeForm}/>`, root);

		act(function() {
			findByText(root, 'button', 'Add Bike').click();
		});
		expect(root.querySelectorAll('form').length).toEqual(2);

		act(function() {
			findByText(root, 'button', 'Add Bike').click();
		});
		expect(root.querySelectorAll('form').length).toEqual(3);

		changeField(root.querySelectorAll('[name=chainringTeeth]')[1], '24');

		act(function() {
			findByText(root, 'button', 'Remove').click();
		});

		expect(root.querySelectorAll('form').length).toEqual(2);
		expect(root.querySelectorAll('[name=chainringTeeth]')[0].value)
			.toEqual('24');
	});

	describe('An individual form', function() {
		it('does not initially display a result', function() {
			const root = document.createElement('div');
			render(html`<${MultiBikeForm}/>`, root);

			expect(root.querySelector('.result').textContent).toEqual('');
		});

		it('displays gear inches when all inputs are valid', function() {
			const root = document.createElement('div');
			render(html`<${MultiBikeForm}/>`, root);

			selectOption(root.querySelector('[name="wheelSize"]'), '26 x 1.5"');
			changeField(root.querySelector('[name=chainringTeeth]'), '42');
			changeField(root.querySelector('[name=cogTeeth]'), '24');

			expect(root.querySelector('.result').textContent)
				.toEqual('43.5225 inches');
		});
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