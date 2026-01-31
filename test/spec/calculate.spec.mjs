import {calculate} from "../../app.mjs";

describe('calculate', function() {
	describe('When there is a valid chainring and at least one valid cog', function() {
		it('returns ratios for all valid cogs', function() {
			const input = {
				wheelSize: '24.87',
				chainring: '52',
				cogs: ['32', '28', '14', 'bogus', '']
			};
			const result = calculate(input)
			expect(result).toEqual({
				chainring: 52,
				cogs: [32, 28, 14],
				ratios: [
					roundsTo(40.41, 2),
					roundsTo(46.19, 2),
					roundsTo(92.37, 2)
				]
			});
		});

		it('handles gaps in the list of valid cogs', function() {
			const input = {
				wheelSize: '24.87',
				chainring: '52',
				cogs: ['32', '', '14',]
			};
			const result = calculate(input)
			expect(result).toEqual({
				chainring: 52,
				cogs: [32, 14],
				ratios: [roundsTo(40.41, 2), roundsTo(92.37, 2)]
			});
		});
	});

	it('returns null when the chainring is invalid', function() {
		const input = {
			wheelSize: '24.87',
			chainring: 'NaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaN',
			cogs: ['32', '28', '14']
		};
		const result = calculate(input);
		expect(result).toBeNull();
	});

	it('returns null when no cogs are valid', function() {
		const input = {
			wheelSize: '24.87',
			chainring: '42',
			cogs: ['nope', 'wrong', '']
		};
		const result = calculate(input);
		expect(result).toBeNull();
	});

	function roundsTo(expected, decimalPlaces) {
		expected = expected.toFixed(decimalPlaces);
		return {
			asymmetricMatch(actual) {
				return actual.toFixed(decimalPlaces) === expected;
			},
			jasmineToString() {
				return `<a number that rounds to ${expected}>`;
			}
		}
	}
});