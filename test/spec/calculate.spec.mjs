import {calculate} from "../../app.mjs";

describe('calculate', function() {
	describe('When there is at least one valid chainring and at least one valid cog', function() {
		it('returns ratios for all combinations of valid gears', function() {
			const result = calculate('gi', {
				tireSize: '24.87',
				chainrings: ['52', '42', 'bogus', ''],
				cogs: ['32', '28', '14', 'bogus', '']
			})
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
			const result = calculate('gi', {
				tireSize: '24.87',
				chainrings: ['52'],
				cogs: ['32', '', '14',]
			})
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
			const result = calculate('gi', {
				tireSize: '24.87',
				chainrings: ['52', '', '42'],
				cogs: ['14']
			});
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
		const result = calculate('gi', {
			tireSize: '24.87',
			chainrings: ['NaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaN', 'nope', ''],
			cogs: ['32', '28', '14']
		});
		expect(result).toBeNull();
	});

	it('returns null when no cogs are valid', function() {
		const result = calculate('gi', {
			tireSize: '24.87',
			chainrings: ['42'],
			cogs: ['nope', 'wrong', '']
		});
		expect(result).toBeNull();
	});

	describe('Units', function() {
		const scenarios = [
			{
				id: 'gi',
				label: 'Gear inches',
				expected: 92.4
			},
			{
				id: 'mph90',
				label: 'MPH @ 90 RPM',
				expected: 24.7
			},
			{
				id: 'mph60',
				label: 'MPH @ 60 RPM',
				expected: 16.5
			}
		];

		for (const {id, label, expected} of scenarios) {
			it(`handles ${label}`, function() {
				const result = calculate(id, {
					tireSize: '24.87',
					chainrings: ['52'],
					cogs: ['14']
				});
				expect(result.ratios[0][0]).toEqual(roundsTo(expected, 1));
			});
		}
	})


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