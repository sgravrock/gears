import { html } from 'htm/preact';
import { render } from 'preact';
import {UrlBasedState, bikesFromHash, hashFromBikes, config} from '../../app.mjs';

describe('state', function() {
	describe('UrlBasedState', function () {
		it('maps a populated hash to bikes', function () {
			const hash = '#ws0=24.87&cr0=42&cg0=13&' +
				'ws2=27.32&cr2=&cg2=&' +
				'ws3=27.32&cr3=32&cg3=36';
			const expected = [
				{id: 0, wheelSize: 24.87, chainring: 42, cog: 13},
				{id: 2, wheelSize: 27.32},
				{id: 3, wheelSize: 27.32, chainring: 32, cog: 36},
			];
			const callback = jasmine.createSpy('callback');

			const root = document.createElement('div');
			render(html`<${UrlBasedState} location=${{hash}}>
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
			render(html`<${UrlBasedState} location=${{hash: ''}} history=${{replaceState}}>
				${props => {setBikes = props.setBikes;}}
			<//>`, root);

			setBikes([{id: 2, wheelSize: '1.23'}]);

			expect(replaceState).toHaveBeenCalledWith({}, '', '#ws2=1.23')
		});
	});

	describe('bikesFromHash', function() {
		it('returns an initial state when the hash is absent', function () {
			expect(bikesFromHash('')).toEqual([{
				id: 0,
				wheelSize: config.wheels[0].diameterIn
			}]);
		});

		it('provides an initial state the hash is empty', function () {
			expect(bikesFromHash('')).toEqual([{
				id: 0,
				wheelSize: config.wheels[0].diameterIn
			}]);
		});

		it('maps a populated hash to bikes', function () {
			const input = '#ws0=24.87&cr0=42&cg0=13&' +
				'ws2=27.32&cr2=&cg2=&' +
				'ws3=27.32&cr3=32&cg3=36';
			expect(bikesFromHash(input)).toEqual([
				{id: 0, wheelSize: 24.87, chainring: 42, cog: 13},
				{id: 2, wheelSize: 27.32},
				{id: 3, wheelSize: 27.32, chainring: 32, cog: 36},
			]);
		});

		it('is the inverse of hashFromBikes', function() {
			const input = [
				{id: 0, wheelSize: 24.87, chainring: 42, cog: 13},
				{id: 2, wheelSize: 27.32},
				{id: 3, wheelSize: 27.32, chainring: 32, cog: 36},
			];
			expect(bikesFromHash(hashFromBikes(input))).toEqual(input);
		});
	});
});