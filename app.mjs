import {html} from 'htm/preact';
import {useId, useState} from 'preact/hooks';

export const config = {
	wheels: [
		{label: '700c x 38mm', diameterIn: 27.32},
		{label: '26 x 1.5"', diameterIn: 24.87},
	],
	maxNumCogs: 13
};

export function newBike(id) {
	const result = {
		id,
		wheelSize: config.wheels[0].diameterIn,
		cogs: []
	};

	for (let i = 0; i < config.maxNumCogs; i++) {
		result.cogs.push(undefined);
	}

	return result;
}

// All state is stored in the query string. This allows the user to share any
// configuration simply by copying the URL.

export function App() {
	return html`
		<${UrlBasedState} location=${window.location} history=${window.history}>
			${({bikes, setBikes}) => {
				return html`<${MultiBikeForm}
					bikes=${bikes}
					setBikes=${setBikes}
				/>`;
			}}
		<//>`;
}

export function UrlBasedState(props) {
	const [bikes, setBikes] = useState(bikesFromQuery(props.location.search));
	return props.children({
		bikes,
		setBikes: function(newBikes) {
			setBikes(newBikes);
			props.history.replaceState({}, '', queryFromBikes(newBikes));
		}
	});
}

export function bikesFromQuery(queryString) {
	const byId = {};
	const paramToKey = {ws: 'wheelSize', cr: 'chainring', cg: 'cogs'};

	// TODO: error reporting
	for (const [k, v] of new URLSearchParams(queryString)) {
		const m = k.match(/^(ws|cr|cg)([0-9]+)$/);

		if (m) {
			const id = parseInt(m[2], 10);
			const nv = parseFloat(v);

			if (!isNaN(id) && !isNaN(nv)) {
				if (!byId[id]) {
					byId[id] = newBike(id);
				}

				const k = paramToKey[m[1]];

				if (Array.isArray(byId[id][k])) {
					replaceFirstUndefined(byId[id][k], nv);
				} else {
					byId[id][k] = nv;
				}
			}
		}
	}

	if (Object.keys(byId).length === 0) {
		return [newBike(0)];
	}

	// Sort by ID
	return Object.keys(byId)
		.sort((a, b) => a[1] - b[1])
		.map(id => byId[id]);
}

function replaceFirstUndefined(arr, v) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === undefined) {
			arr[i] = v;
			return;
		}
	}
}

export function queryFromBikes(bikes) {
	let params = [];

	for (const b of bikes) {
		params.push([`ws${b.id}`, b.wheelSize]);
		params.push([`cr${b.id}`, b.chainring]);

		for (let i = 0; i < b.cogs.length; i++) {
			params.push([`cg${b.id}`, b.cogs[i]]);
		}
	}

	// Omit params that haven't been set yet
	params = params.filter(p => !!p[1]);
	return '?' + new URLSearchParams(params).toString();
}

export function MultiBikeForm(props) {
	function add() {
		const k = maxKey(props.bikes) + 1;
		props.setBikes([...props.bikes, newBike(k)]);
	}

	function replace(newBike, i) {
		const result = [...props.bikes];
		result[i] = newBike;
		props.setBikes(result);
	}

	function remove(bike) {
		props.setBikes(props.bikes.filter(b => b !== bike));
	}

	const canRemove = props.bikes.length > 1;

	return html`
		<div>
			${props.bikes.map((b, i) => html`
				<div key=${b.id}>
					<${BikeForm}bike=${b} setBike=${nb => replace(nb, i)} />
					${canRemove && 
						html`<button onclick=${() => remove(b)}>Remove</button>`
					}
				</div>
			`)}
			<button onclick=${add}>Add Bike</button>
		</div>`;
}

function maxKey(bikes) {
	let result;

	for (const b of bikes) {
		if (result === undefined || result < b.id) {
			result = b.id;
		}
	}

	return result;
}

export function BikeForm(props) {
	function setWheelSize(wheelSize) {
		props.setBike({...props.bike, wheelSize});
	}

	function setChainring(chainring) {
		props.setBike({...props.bike, chainring})
	}

	function setCog(cog, i) {
		const cogs = [...props.bike.cogs];
		cogs[i] = cog;
		props.setBike({...props.bike, cogs})
	}

	const result = calculate(props.bike);

	const wheelSizeId = useId();
	const chainringId = useId();

	return html`<form>
		<table>
			<tr>
				<td><label for=${wheelSizeId}>Wheel size</label></td>
				<td>
					<${Select}
						id=${wheelSizeId}
						name="wheelSize"
						options=${config.wheels}
						optionKey="diameterIn"
						selectedKey=${props.bike.wheelSize}
						onchange=${setWheelSize}
					/>
				</td>
			</tr>
			<tr>
				<td><label for=${chainringId}>Chainring</label></td>
				<td>
					<input 
						id=${chainringId} 
						name="chainring" 
						value=${props.bike.chainring} 
						onchange=${e => setChainring(e.target.value)}
						size="2"
					/>
				</td>
			</tr>
			<tr>
				<td>Cogs</td>
				<td>
					${props.bike.cogs.map((cog, i) => html`
						<input
							name="cog${i}"
							value=${cog}
							onchange=${e => setCog(e.target.value, i)}
							size="2"
						/>
					`)}
				</td>
			</tr>
		</table>
		${result && html`<${ResultTable} result=${result} />`}
	</form>`;
}

function calculate(bike) {
	// TODO: better validation. This accepts decimal values.
	const chainring = parseInt(bike.chainring, 10);
	const cogs = bike.cogs
		.map(c => parseInt(c, 10))
		.filter(t =>!isNaN(t));

	if (cogs.length === 0 || isNaN(chainring)) {
		return null;
	}

	return {
		chainring,
		cogs,
		ratios: cogs.map(c => chainring / c * bike.wheelSize)
	}
}

function ResultTable(props) {
	const rows = [];
	for (let i = 0; i < props.result.cogs.length; i++) {
		rows.push(html`
			<tr>
				<th>${props.result.cogs[i]}</th>
				<td>${props.result.ratios[i].toFixed(1)}</td>
			</tr>`
		);
	}

	return html`
		<table class="result">
			<thead>
			<tr>
				<th>${props.result.chainring}</th>
			</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>`;
}

function Select(props) {
	const options = props.options.map(o => {
		const k = o[props.optionKey];
		const selected = k === props.selectedKey;
		return html`<option key=${k} value=${k} selected=${selected}>
			${o.label}
		</option>`;
	});

	return html`
		<select
			id=${props.id}
			name=${props.name}
			onchange=${e => props.onchange(e.target.value)}
		>
			${options}
		</select>`;
}