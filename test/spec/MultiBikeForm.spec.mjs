import {MultiBikeForm, newBike} from "../../app.mjs";
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
		expect(root.querySelectorAll('.bike-form').length).toEqual(2);

		act(function() {
			findByText(root, 'button', 'Add Bike').click();
		});
		expect(root.querySelectorAll('.bike-form').length).toEqual(3);

		changeField(root.querySelector('[name="chainring2.0"]'), '24');

		act(function() {
			findByText(root, 'button', 'Remove').click();
		});

		expect(root.querySelectorAll('.bike-form').length).toEqual(2);
		expect(root.querySelector('[name="chainring2.0"]').value)
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
		it('initially selects the default tire size', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			expect(root.querySelector('[name="tireSize0"]').value)
				.toEqual('26-24.87');
		});

		it('does not initially display a result', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			expect(root.querySelector('.result')).toBeFalsy();
		});

		it('displays results when all inputs are valid', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			selectOption(root.querySelector('[name="tireSize0"]'),
				'26 X 1.5\" / 38-559');
			changeField(root.querySelector('[name="chainring0.0"]'), '42');
			changeField(root.querySelector('[name="cog0.0"]'), '24');

			expect(root.querySelector('.result td').textContent)
				.toEqual('43.5');
		});

		it('supports multiple cogs', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			jasmine.debugLog(root.innerHTML);
			selectOption(root.querySelector('[name="tireSize0"]'),
				'26 X 1.5" / 38-559');
			changeField(root.querySelector('[name="chainring0.0"]'), '42');
			const cog0Field = root.querySelector('[name="cog0.0"]')
			const cog1Field = root.querySelector('[name="cog0.1"]')
			changeField(cog0Field, '24');
			changeField(cog1Field, '13');

			const resultHeaderCells = Array.from(root.querySelectorAll(
				'.result thead th'));
			expect(resultHeaderCells.map(c => c.textContent))
				.withContext('chainring header cells')
				.toEqual(['', '42']);
			const resultBodyRows = root.querySelectorAll('.result tbody tr');
			expect(resultBodyRows.length)
				.withContext('result body rows')
				.toEqual(2);
			expect(resultBodyRows[0].querySelector('th').textContent)
				.withContext('first cog header')
				.toEqual('24');
			let cells = Array.from(resultBodyRows[0].querySelectorAll('td'));
			expect(cells.map(c => c.textContent))
				.withContext('first cog ratios')
				.toEqual(['43.5']); // 24.87 * 42 / 24
			expect(resultBodyRows[1].querySelector('th').textContent)
				.withContext('second cog header')
				.toEqual('13');
			cells = Array.from(resultBodyRows[1].querySelectorAll('td'));
			expect(cells.map(c => c.textContent))
				.withContext('second cog ratios')
				.toEqual(['80.3']); // 24.87 * 42 / 13
		});

		it('keeps the cassette dropdown and cog fields in sync', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);
			const cogField = i => root.querySelector(`[name="cog0.${i}"]`);
			const cassetteDropdown = () => root.querySelector('[name=cassette0]');

			selectOption(cassetteDropdown(), 'Shimano L 12-13-14-15-17-19-21');
			const expectedCogs = ['12', '13', '14', '15', '17', '19', '21',
				'', '', '', '', '', ''];
			for (let i = 0; i < 13; i++) {
				expect(cogField(i).value)
					.withContext(`cog ${i} after first cassette selection`)
					.toEqual(expectedCogs[i]);
			}

			changeField(cogField(0), '11');
			expect(cassetteDropdown().value).toEqual('custom');

			changeField(cogField(7), '36');
			selectOption(cassetteDropdown(), 'Shimano L 12-13-14-15-17-19-21');
			for (let i = 0; i < 13; i++) {
				expect(cogField(i).value)
					.withContext(`cog ${i} after second cassette selection`)
					.toEqual(expectedCogs[i]);
			}
		});

		it('supports multiple chainrings', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			selectOption(root.querySelector('[name="tireSize0"]'),
				'26 X 1.5" / 38-559');
			changeField(root.querySelector('[name="chainring0.0"]'), '53');
			changeField(root.querySelector('[name="chainring0.1"]'), '39');
			changeField(root.querySelector('[name="chainring0.2"]'), '30');
			changeField(root.querySelector('[name="cog0.0"]'), '24');

			const resultHeaderCells = Array.from(root.querySelectorAll(
				'.result thead th'));
			expect(resultHeaderCells.map(c => c.textContent))
				.withContext('chainring header cells')
				.toEqual(['', '53', '39', '30']);
			const resultBodyRows = root.querySelectorAll('.result tbody tr');
			expect(resultBodyRows.length)
				.withContext('result body rows')
				.toEqual(1);
			expect(resultBodyRows[0].querySelector('th').textContent)
				.withContext('cog header')
				.toEqual('24');
			let cells = Array.from(resultBodyRows[0].querySelectorAll('td'));
			expect(cells.map(c => c.textContent))
				.withContext('first cog ratios')
				.toEqual([
					'54.9', // 24.87 * 53 / 24,
					'40.4', // 24.87 * 39 / 24,
					'31.1', // 24.87 * 30 / 24,
				]);
		})

		it('supports duplicate tire sizes', function() {
			const root = document.createElement('div');
			render(html`<${TestFormStateContainer}/>`, root);

			// These have the same diameter
			const options = [
				'700c X 32mm / 32-622',
				'27 X 1 1/8\" / 28-630',
			];
			const dropdown = () => root.querySelector('[name="tireSize0"]');

			for (const opt of options) {
				selectOption(dropdown(), opt);
				expect(dropdown().selectedOptions[0].textContent).toEqual(opt);
			}
		});
	});

	function TestFormStateContainer() {
		const initialBikes = [newBike(0)];
		const [bikes, setBikes] = useState(initialBikes);
		const [unit, setUnit] = useState('gi');
		return html`<${MultiBikeForm} 
			bikes=${bikes}
			setBikes=${setBikes}
			unit=${unit}
			setUnit=${setUnit}
		/>`;
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