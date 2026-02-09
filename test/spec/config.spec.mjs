import config from '../../config.mjs';

describe('Config', function() {
	// TODO: fix duplicates and enable this
	xdescribe('tireGroups', function () {
		hasNoDuplicates(config.tireGroups, 'diameterIn');
	});

	describe('cassetteGroups', function() {
		hasNoDuplicates(config.cassetteGroups, 'value');

		it('is grouped by cog count', function() {
			for (const group of config.cassetteGroups) {
				const groupNCogs = parseInt(group.label.replace(/-speed$/, ''), 10);
				expect(isNaN(groupNCogs)).toBe(false);

				for (const opt of group.options) {
					const optNCogs = opt.value.split('-').length;
					expect(optNCogs)
						.withContext(`${group.label}: ${opt.label}`)
						.toEqual(groupNCogs);
				}
			}
		});

		it("includes each option's value in the label", function() {
			for (const group of config.cassetteGroups) {
				for (const opt of group.options) {
					expect(opt.label)
						.withContext(`${group.label}: ${opt.label}`)
						.toContain(opt.value);

				}
			}
		});
	});

	function hasNoDuplicates(groups, optionValueProp) {
		it('has no duplicates', function () {
			expect(findDupes()).toEqual([]);
		});

		function findDupes() {
			const byValue = {};

			for (const group of groups) {
				for (const opt of group.options) {
					const value = opt[optionValueProp];
					const label = `${group.label}: ${opt.label}`;

					if (byValue[value]) {
						byValue[value].push(label);
					} else {
						byValue[value] = [label];
					}
				}
			}

			return Object.entries(byValue)
				.filter(([v, lbls]) => lbls.length > 1);
		}
	}
});