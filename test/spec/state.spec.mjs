import { html } from 'htm/preact';
import { render } from 'preact';
import {UrlBasedState, bikesFromQuery, queryFromBikes, config, newBike} from '../../app.mjs';

describe('state', function() {
	describe('UrlBasedState', function () {
		it('maps a populated query string to bikes', function () {
			const search = '?ws0=24.87&cr0=42&cg0.0=11&' +
				'ws2=27.32&cr2=&cg2.0=&' +
				'ws3=27.32&cr3=32&cg3.0=36&cg3.1=32';
			const expected = [
				{id: 0, wheelSize: 24.87, chainring: 42, cogs: pad([11], 13)},
				{id: 2, wheelSize: 27.32, cogs: pad([], 13)},
				{id: 3, wheelSize: 27.32, chainring: 32,
					cogs: pad([36, 32], 13)},
			];
			const callback = jasmine.createSpy('callback');

			const root = document.createElement('div');
			render(html`<${UrlBasedState} location=${{search}}>
				${callback}
			<//>`, root);

			expect(callback).toHaveBeenCalledWith({
				bikes: expected,
				setBikes: jasmine.any(Function),
			});
		});

		it('calls history.replaceState when state changes', function() {
			const replaceState = jasmine.createSpy('replaceState');
			let setBikes;
			const root = document.createElement('div');
			render(html`<${UrlBasedState} location=${{search: ''}} history=${{replaceState}}>
				${props => {setBikes = props.setBikes;}}
			<//>`, root);

			setBikes([{...newBike(2), wheelSize: '1.23'}]);

			expect(replaceState).toHaveBeenCalledWith({}, '', '?ws2=1.23')
		});
	});

	describe('bikesFromQuery', function() {
		it('returns an initial state when the query string is absent', function () {
			expect(bikesFromQuery('')).toEqual([newBike(0)]);
		});

		it('returns an initial state when the query string is empty', function () {
			expect(bikesFromQuery('?')).toEqual([newBike(0)]);
		});

		it('maps a populated query string to bikes', function () {
			const input = '?ws0=24.87&cr0=42&cg0.0=11&' +
				'ws2=27.32&cr2=&cg2.0=&' +
				'ws3=27.32&cr3=32&cg3.0=36&cg3.2=24';
			expect(bikesFromQuery(input)).toEqual([
				{id: 0, wheelSize: 24.87, chainring: 42, cogs: pad([11], 13)},
				{id: 2, wheelSize: 27.32, cogs: pad([], 13)},
				{id: 3, wheelSize: 27.32, chainring: 32,
					cogs: pad([36, undefined, 24], 13)},
			]);
		});

		it('is the inverse of queryFromBikes', function() {
			const input = [
				{id: 0, wheelSize: 24.87, chainring: 42, cogs: pad([11], 13)},
				{id: 2, wheelSize: 27.32, cogs: pad([], 13)},
				{id: 3, wheelSize: 27.32, chainring: 32,
					cogs: pad([36, undefined, 24], 13)},
			];
			expect(bikesFromQuery(queryFromBikes(input))).toEqual(input);
		});
	});

	function pad(a, len) {
		a = [...a];

		while (a.length < len) {
			a.push(undefined);
		}

		return a;
	}
});