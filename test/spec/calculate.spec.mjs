import {calculate} from "../../app.mjs";

describe('calculate', function() {
	describe('When there is at least one valid chainring and at least one valid cog', function() {
		it('returns ratios for all combinations of valid gears', function() {
			const input = {
				wheelSize: '24.87',
				chainrings: ['52', '42', 'bogus', ''],
				cogs: ['32', '28', '14', 'bogus', '']
			};
			const result = calculate(input)
			expect(result).toEqual({
				chainrings: [52, 42],
				cogs: [32, 28, 14],
				ratios: [
					[roundsTo(40.41, 2), roundsTo(32.64, 2)],
					[roundsTo(46.19, 2), roundsTo(37.30, 2)],
					[roundsTo(92.37, 2), roundsTo(74.61, 2)],
				]
			});
		});

		it('handles gaps in the lists of valid cogs', function() {
			const input = {
				wheelSize: '24.87',
				chainrings: ['52'],
				cogs: ['32', '', '14',]
			};
			const result = calculate(input)
			expect(result).toEqual({
				chainrings: [52],
				cogs: [32, 14],
				ratios: [
					[roundsTo(40.41, 2)],
					[roundsTo(92.37, 2)]
				]
			});
		});

		it('handles gaps in the lists of valid chainrings', function() {
			const input = {
				wheelSize: '24.87',
				chainrings: ['52', '', '42'],
				cogs: ['14']
			};
			const result = calculate(input)
			expect(result).toEqual({
				chainrings: [52, 42],
				cogs: [14],
				ratios: [
					[roundsTo(92.37, 2), roundsTo(74.61, 2)],
				]
			});
		});
	});

	it('returns null when no chainrings are valid', function() {
		const input = {
			wheelSize: '24.87',
			chainrings: ['NaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaN', 'nope', ''],
			cogs: ['32', '28', '14']
		};
		const result = calculate(input);
		expect(result).toBeNull();
	});

	it('returns null when no cogs are valid', function() {
		const input = {
			wheelSize: '24.87',
			chainrings: ['42'],
			cogs: ['nope', 'wrong', '']
		};
		const result = calculate(input);
		expect(result).toBeNull();
	});

	function roundsTo(expected, decimalPlaces) {
		expected = expected.toFixed(decimalPlaces);
		return {
			asymmetricMatch(actual) {
				return typeof actual === 'number' &&
					actual.toFixed(decimalPlaces) === expected;
			},
			jasmineToString() {
				return `<a number that rounds to ${expected}>`;
			}
		}
	}
});