import { html } from 'htm/preact';
import { render } from 'preact';
import {UrlBasedState, stateFromQuery, queryFromState, newBike} from '../../app.mjs';

describe('state', function() {
	describe('UrlBasedState', function () {
		it('maps a populated query string to bikes and units', function () {
			const search = '?ts0=26-24.87&cr0.0=42&cg0.0=11&' +
				'ts2=700c-27.32&cr2=&cg2.0=&' +
				'ts3=700c-27.32&cr3.0=32&cr3.1=22&cg3.0=36&cg3.1=32&' +
				'u=mph90';
			const expectedBikes = [
				{
					id: 0,
					tireSize: '26-24.87',
					chainrings: pad([42], 3),
					cogs: pad([11], 13)
				},
				{
					id: 2,
					tireSize: '700c-27.32',
					chainrings: pad([], 3),
					cogs: pad([], 13)
				},
				{
					id: 3,
					tireSize: '700c-27.32',
					chainrings: pad([32, 22], 3),
					cogs: pad([36, 32], 13)
				},
			];
			const callback = jasmine.createSpy('callback');

			const root = document.createElement('div');
			render(html`<${UrlBasedState} location=${{search}}>
				${callback}
			<//>`, root);

			expect(callback).toHaveBeenCalledWith({
				bikes: expectedBikes,
				setBikes: jasmine.any(Function),
				unit: 'mph90',
				setUnit: jasmine.any(Function),
			});
		});

		it('calls history.replaceState when setBikes is called', function() {
			const replaceState = jasmine.createSpy('replaceState');
			let setBikes;
			const root = document.createElement('div');
			render(html`
				<${UrlBasedState} 
					location=${{search: ''}} 
					history=${{replaceState}}>
						${props => {setBikes = props.setBikes;}}
				<//>`, root);

			setBikes([{...newBike(2), tireSize: '1.23'}]);

			expect(replaceState).toHaveBeenCalledWith({}, '', '?ts2=1.23&u=gi');
		});

		it('calls history.replaceState when setUnit is called', function() {
			const replaceState = jasmine.createSpy('replaceState');
			let setUnit;
			const root = document.createElement('div');
			render(html`
				<${UrlBasedState}
					location=${{search: ''}}
					history=${{replaceState}}>
						${props => {setUnit = props.setUnit;}}
				<//>`, root);

			setUnit('mph60');

			expect(replaceState).toHaveBeenCalledWith({}, '',
				'?ts0=26-24.87&u=mph60');
		});
	});

	describe('stateFromQuery', function() {
		it('returns an initial state when the query string is absent', function () {
			expect(stateFromQuery('')).toEqual({
				bikes: [newBike(0)],
				unit: 'gi'
			});
		});

		it('returns an initial state when the query string is empty', function () {
			expect(stateFromQuery('?')).toEqual({
				bikes: [newBike(0)],
				unit: 'gi'
			});
		});

		it('maps a populated query string to state', function () {
			const input = '?ts0=26-24.87&cr0.0=52&cr0.1=42&cg0.0=11&' +
				'ts2=700c-27.32&cr2.0=&cg2.0=&' +
				'ts3=700c-27.32&cr3.0=32&cg3.0=36&cg3.2=24&' +
				'u=mph90';
			expect(stateFromQuery(input)).toEqual({
				bikes: [
					{
						id: 0,
						tireSize: '26-24.87',
						chainrings: pad([52, 42], 3),
						cogs: pad([11], 13)
					},
					{
						id: 2,
						tireSize: '700c-27.32',
						chainrings: pad([], 3),
						cogs: pad([], 13)},
					{
						id: 3,
						tireSize: '700c-27.32',
						chainrings: pad([32], 3),
						cogs: pad([36, undefined, 24], 13)
					},
				],
				unit: 'mph90'
			});
		});

		it('is the inverse of queryFromState', function() {
			const input = {
				bikes: [
					{
						id: 0,
						tireSize: '26-24.87',
						chainrings: pad([42], 3),
						cogs: pad([11], 13)
					},
					{
						id: 2,
						tireSize: '700c-27.32',
						chainrings: pad([], 3),
						cogs: pad([], 13)
					},
					{
						id: 3,
						tireSize: '700c-27.32',
						chainrings: pad([32], 3),
						cogs: pad([36, undefined, 24], 13)
					},
				],
				unit: 'mph60'
			};
			const qs = queryFromState(input);
			jasmine.debugLog('query string: ' + qs);
			expect(stateFromQuery(qs)).toEqual(input);
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