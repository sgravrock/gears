import {html} from 'htm/preact';
import {useId, useState} from 'preact/hooks';

export const config = {
	wheels: [
		{label: '700c x 38mm', diameterIn: 27.32},
		{label: '26 x 1.5"', diameterIn: 24.87},
	],
	maxNumChainrings: 3,
	maxNumCogs: 13
};

export function newBike(id) {
	return {
		id,
		wheelSize: config.wheels[0].diameterIn,
		chainrings: arrayOfUndefined(config.maxNumChainrings),
		cogs: arrayOfUndefined(config.maxNumCogs),
	};
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

export function UrlBasedState({location, history, children}) {
	const [bikes, setBikes] = useState(bikesFromQuery(location.search));
	return children({
		bikes,
		setBikes: function(newBikes) {
			setBikes(newBikes);
			history.replaceState({}, '', queryFromBikes(newBikes));
		}
	});
}

export function bikesFromQuery(queryString) {
	const byId = {};

	// TODO: error reporting?
	for (const [paramName, v] of new URLSearchParams(queryString)) {
		// e.g. cg1.3 produces groups cg, 1, and 3
		const m = paramName.match(/^(ws|cr|cg)([0-9]+)(?:\.([0-9]+))?$/);
		if (!m) {
			continue;
		}

		const bikeId = parseInt(m[2], 10);
		const fieldIx = parseInt(m[3], 10);
		const nv = parseFloat(v);

		if (isNaN(bikeId)
				|| isNaN(nv)
				|| (m[1] !== 'ws' && isNaN(fieldIx))) {
			continue;
		}

		if (!byId[bikeId]) {
			byId[bikeId] = newBike(bikeId);
		}

		if (m[1] === 'ws') {
			byId[bikeId].wheelSize = nv;
		} else if (m[1] === 'cr') {
			byId[bikeId].chainrings[fieldIx] = nv;
		} else {
			byId[bikeId].cogs[fieldIx] = nv;
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

export function queryFromBikes(bikes) {
	let params = [];

	for (const b of bikes) {
		params.push([`ws${b.id}`, b.wheelSize]);

		for (let i = 0; i < b.chainrings.length; i++) {
			params.push([`cr${b.id}.${i}`, b.chainrings[i]]);
		}

		for (let i = 0; i < b.cogs.length; i++) {
			params.push([`cg${b.id}.${i}`, b.cogs[i]]);
		}
	}

	// Omit params that haven't been set yet
	params = params.filter(p => !!p[1]);
	return '?' + new URLSearchParams(params).toString();
}

export function MultiBikeForm({bikes, setBikes}) {
	function add() {
		const k = maxKey(bikes) + 1;
		setBikes([...bikes, newBike(k)]);
	}

	function replace(newBike, i) {
		const result = [...bikes];
		result[i] = newBike;
		setBikes(result);
	}

	function remove(bike) {
		setBikes(bikes.filter(b => b !== bike));
	}

	const canRemove = bikes.length > 1;

	return html`
		<form onsubmit=${e => {e.preventDefault();}}>
			${bikes.map((b, i) => html`
				<div key=${b.id}>
					<${BikeForm}bike=${b} setBike=${nb => replace(nb, i)} />
					${canRemove && 
						html`<button onclick=${() => remove(b)}>Remove</button>`
					}
				</div>
			`)}
			<button onclick=${add}>Add Bike</button>
		</form>`;
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

export function BikeForm({bike, setBike}) {
	function setWheelSize(wheelSize) {
		setBike({...bike, wheelSize});
	}

	function setChainring(chainring, i) {
		const chainrings = [...bike.chainrings];
		chainrings[i] = chainring;
		setBike({...bike, chainrings})
	}

	function setCog(cog, i) {
		const cogs = [...bike.cogs];
		cogs[i] = cog;
		setBike({...bike, cogs})
	}

	const result = calculate(bike);

	const wheelSizeId = useId();

	return html`
		<table class="bike-form">
			<tr>
				<td><label for=${wheelSizeId}>Wheel size</label></td>
				<td>
					<${Select}
						id=${wheelSizeId}
						name="wheelSize${bike.id}"
						options=${config.wheels}
						optionKey="diameterIn"
						selectedKey=${bike.wheelSize}
						onchange=${setWheelSize}
					/>
				</td>
			</tr>
			<tr>
				<td>Chainrings</td>
				<td>
					${bike.chainrings.map((c, i) => html`
						<input
							name="chainring${bike.id}.${i}"
							value=${c}
							onchange=${e => setChainring(e.target.value, i)}
							size="2"
						/>

					`)}
				</td>
			</tr>
			<tr>
				<td>Cogs</td>
				<td>
					${bike.cogs.map((cog, i) => html`
						<input
							name="cog${bike.id}.${i}"
							value=${cog}
							onchange=${e => setCog(e.target.value, i)}
							size="2"
						/>
					`)}
				</td>
			</tr>
		</table>
		${result && html`<${ResultTable} result=${result} />`}
	`;
}

export function calculate(bike) {
	// TODO: better validation. This accepts decimal values.
	const chainrings = bike.chainrings
		.map(c => parseInt(c, 10))
		.filter(t =>!isNaN(t));
	const cogs = bike.cogs
		.map(c => parseInt(c, 10))
		.filter(t =>!isNaN(t));

	if (cogs.length === 0 || chainrings.length === 0) {
		return null;
	}

	return {
		chainrings,
		cogs,
		ratios: cogs.map(cog => {
			return chainrings.map(ring => ring / cog * bike.wheelSize);
		})
	}
}

function ResultTable({result}) {
	const rows = [];
	for (let i = 0; i < result.cogs.length; i++) {
		rows.push(html`
			<tr>
				<th>${result.cogs[i]}</th>
				${result.ratios[i].map((r, j) => html`
					<td key=${j}>${r.toFixed(1)}</td>
				`)}
			</tr>`
		);
	}

	return html`
		<table class="result">
			<thead>
				<tr>
					${result.chainrings.map((c, i) => html`
						<th index=${i}>${c}</th>
					`)}
				</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>`;
}

function Select({id, name, options, optionKey, selectedKey, onchange}) {
	return html`
		<select
			id=${id}
			name=${name}
			onchange=${e => onchange(e.target.value)}
		>
			${options.map(o => {
				const k = o[optionKey];
				const selected = k === selectedKey;
				return html`<option key=${k} value=${k} selected=${selected}>
					${o.label}
				</option>`;
			})}
		</select>`;
}

function arrayOfUndefined(n) {
	const a = [];

	for (let i = 0; i < n; i++) {
		a.push(undefined);
	}

	return a;
}
