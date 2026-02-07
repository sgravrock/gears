import { render } from 'preact';
import {html} from '../../vendor/htm-preact.mjs';
import {Select} from '../../app.mjs';

describe('Select', function() {
	it('renders ungrouped options', function() {
		const options = [
			{label: 'foo', value: 1},
			{label: 'bar', value: 2},
		]
		const root = document.createElement('div');
		render(html`<${Select} 
				options=${options}
				optionKey="value"
				selectedKey=${2}
			/>`,
			root);

		const optionEls = Array.from(root.querySelectorAll('option'));
		expect(optionEls.map(o => o.value)).toEqual(['1', '2']);
		expect(optionEls.map(o => o.textContent)).toEqual(['foo', 'bar']);
		expect(optionEls.map(o => o.selected)).toEqual([false, true]);
		expect(root.querySelector('optgroup')).toBeFalsy();
	});

	it('renders grouped options', function() {
		const optionGroups = [
			{
				label: 'Group A',
				options: [
					{label: 'foo', value: 1},
					{label: 'bar', value: 2},
				]
			},
			{
				label: 'Group B',
				options: [
					{label: 'baz', value: 3},
					{label: 'qux', value: 4},
				]
			},
		]
		const root = document.createElement('div');
		render(html`<${Select}
				optionGroups=${optionGroups}
				optionKey="value"
				selectedKey=${3}
			/>`,
			root);

		expect(root.querySelector('select>option')).toBeFalsy();
		const groupEls = Array.from(root.querySelectorAll('optgroup'));
		expect(groupEls.map(g => g.label)).toEqual(['Group A', 'Group B'])
		const group0Opts = Array.from(groupEls[0].querySelectorAll('option'));
		const group1Opts = Array.from(groupEls[1].querySelectorAll('option'));
		expect(group0Opts.map(o => o.value)).toEqual(['1', '2']);
		expect(group0Opts.map(o => o.textContent)).toEqual(['foo', 'bar']);
		expect(group0Opts.map(o => o.selected)).toEqual([false, false]);
		expect(group1Opts.map(o => o.value)).toEqual(['3', '4']);
		expect(group1Opts.map(o => o.textContent)).toEqual(['baz', 'qux']);
		expect(group1Opts.map(o => o.selected)).toEqual([true, false]);
	})

})