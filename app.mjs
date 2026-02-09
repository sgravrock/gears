import {Fragment} from 'preact';
import {html} from 'htm/preact';
import {useId, useState} from 'preact/hooks';

import config from './config.mjs';
const customCassetteValue = 'custom';

export function newBike(id) {
	return {
		id,
		tireSize: config.defaultTireSize,
		chainrings: arrayOfUndefined(config.maxNumChainrings),
		cogs: arrayOfUndefined(config.maxNumCogs),
	};
}

// All state is stored in the query string. This allows the user to share any
// configuration simply by copying the URL.

export function App() {
	return html`
		<${UrlBasedState} location=${window.location} history=${window.history}>
			${({bikes, setBikes, unit, setUnit}) => {
				return html`<${MultiBikeForm}
					bikes=${bikes}
					setBikes=${setBikes}
					unit=${unit}
					setUnit=${setUnit}
				/>`;
			}}
		<//>`;
}

export function UrlBasedState({location, history, children}) {
	const initialState = stateFromQuery(location.search);
	const [bikes, setBikes] = useState(initialState.bikes);
	const [unit, setUnit] = useState(initialState.unit);

	return children({
		bikes,
		setBikes: function(newBikes) {
			setBikes(newBikes);
			history.replaceState({}, '',
				queryFromState({bikes: newBikes, unit}));
		},
		unit,
		setUnit: function(newUnit) {
			setUnit(newUnit);
			history.replaceState({}, '', queryFromState({unit: newUnit, bikes}));
		}
	});
}

export function stateFromQuery(queryString) {
	const params = new URLSearchParams(queryString);

	return {
		bikes: bikesFromQueryParams(params),
		unit: params.get('u') ?? config.units[0].id
	};
}

function bikesFromQueryParams(urlSearchParams) {
	const byId = {};

	// TODO: error reporting?
	for (const [paramName, v] of urlSearchParams) {
		// e.g. cg1.3 produces groups cg, 1, and 3
		const m = paramName.match(/^(ts|cr|cg)([0-9]+)(?:\.([0-9]+))?$/);
		if (!m) {
			continue;
		}

		const bikeId = parseInt(m[2], 10);
		const fieldIx = parseInt(m[3], 10);
		const nv = parseFloat(v);

		if (isNaN(bikeId)
				|| isNaN(nv)
				|| (m[1] !== 'ts' && isNaN(fieldIx))) {
			continue;
		}

		if (!byId[bikeId]) {
			byId[bikeId] = newBike(bikeId);
		}

		if (m[1] === 'ts') {
			byId[bikeId].tireSize = nv;
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

export function queryFromState({bikes, unit}) {
	const params = [
		...queryParamsFromBikes(bikes),
		['u', unit]
	];
	return '?' + new URLSearchParams(params).toString();
}

function queryParamsFromBikes(bikes) {
	let params = [];

	for (const b of bikes) {
		params.push([`ts${b.id}`, b.tireSize]);

		for (let i = 0; i < b.chainrings.length; i++) {
			params.push([`cr${b.id}.${i}`, b.chainrings[i]]);
		}

		for (let i = 0; i < b.cogs.length; i++) {
			params.push([`cg${b.id}.${i}`, b.cogs[i]]);
		}
	}

	// Omit params that haven't been set yet
	return params.filter(p => !!p[1]);
}

export function MultiBikeForm({bikes, setBikes, unit, setUnit}) {
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
			<label>
				Unit:
				<${Select}
					name="unit"
					options=${config.units}
					optionKey="id"
					selectedKey=${unit}
					onchange=${setUnit}
				/>
			</label>
			<table class="bikes">
				${bikes.map((b, i) => html`
					<${Fragment} key=${b.id}>
						<${BikeForm} 
							bike=${b} 
							setBike=${nb => replace(nb, i)}
							canRemove=${canRemove}
							remove=${() => remove(b)}
							unit=${unit}
						/>
					</${Fragment}>
				`)}
			</div>
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

export function BikeForm({bike, setBike, unit, remove, canRemove}) {
	function setTireSize(tireSize) {
		setBike({...bike, tireSize});
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

	const result = calculate(unit, bike);

	const tireSizeId = useId();

	// Select the option from the cassette dropdown that matches the current
	// cogs, or custom if there is no match. This keeps the dropdown and the
	// cog fields in sync. It requires that no two dropdown entries provide the
	// same cogs.
	let selectedCassette = cogsToCassette(bike.cogs)
	if (!cassetteExists(selectedCassette)) {
		selectedCassette = customCassetteValue;
	}

	function selectCassette(value) {
		const cogs = value.split('-');

		while (cogs.length < config.maxNumCogs) {
			cogs.push('');
		}

		setBike({...bike, cogs});
	}

	return html`
		<tr>
			<td>
				<table class="bike-form">
					<tr>
						<td><label for=${tireSizeId}>Tire size</label></td>
						<td>
							<${Select}
								id=${tireSizeId}
								name="tireSize${bike.id}"
								optionGroups=${config.tireGroups}
								optionKey="diameterIn"
								selectedKey=${bike.tireSize}
								onchange=${setTireSize}
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
						<td>Cassette / Freewheel</td>
						<td>
							<${Select}
								name="cassette${bike.id}"
								options=${[{label: 'Custom', value: customCassetteValue}]}
								optionGroups=${config.cassetteGroups}
								optionKey="value"
								selectedKey=${selectedCassette}
								onchange=${selectCassette}
							/>
							<div class="custom-cogs">
								${bike.cogs.map((cog, i) => html`
									<input
										name="cog${bike.id}.${i}"
										value=${cog}
										onchange=${e => setCog(e.target.value, i)}
										size="2"
									/>
								`)}
							</div>
						</td>
					</tr>
				</table>
				${canRemove && html`<button onclick=${remove}>Remove</button>`}
			</td>
			<td>
				${result && html`<${ResultTable} result=${result} />`}
			</td>
		</tr>
	`;
}

function cogsToCassette(cogs) {
	return cogs.filter(c => c).join('-');
}

function cassetteExists(value) {
	for (const group of config.cassetteGroups) {
		for (const opt of group.options) {
			if (opt.value === value) {
				return true;
			}
		}
	}

	return false;
}

export function calculate(unit, bike) {
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
			return chainrings.map(ring => ratio(unit, bike.tireSize, ring, cog));
		})
	}
}

function ratio(unit, tireSize, chainring, cog) {
	const gearInches = chainring / cog * tireSize;

	switch (unit) {
		case 'gi':
			return gearInches;

		case 'mph60':
		case 'mph90':
			const inchesPerMile = 63360;
			const inchesPerRev = gearInches * Math.PI;
			const rpm = unit === 'mph60' ? 60 : 90;
			return inchesPerRev * rpm * 60 / inchesPerMile;

		default:
			throw new Error(`Unrecognized unit: ${unit}`);
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
		<table class="result" border>
			<thead>
				<tr>
					<th></th>
					${result.chainrings.map((c, i) => html`
						<th key=${i}>${c}</th>
					`)}
				</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>`;
}

// At least one of options and optionGroups should be passed
export function Select({id, name, options, optionGroups,
						optionKey, selectedKey, onchange}) {
	return html`
		<select
			id=${id}
			name=${name}
			onchange=${e => onchange(e.target.value)}
			onchange=${e => onchange(e.target.value)}
		>
			${options && html`
				<${SelectOptions}
					options=${options}
					optionKey=${optionKey}
					selectedKey=${selectedKey}
				/>`
			}
			${optionGroups && optionGroups.map((g) => {
				// Option group labels come from static data,
				// so they make suitable keys
				return html`
					<optgroup key=${g.label} label=${g.label}>
						<${SelectOptions}
							options=${g.options}
							optionKey=${optionKey}
							selectedKey=${selectedKey}
						/>
					</optgroup>
				`;
			})}
		</select>`;
}

function SelectOptions({options, optionKey, selectedKey}) {
	return options.map(o => {
		const k = o[optionKey];
		const selected = k == selectedKey; // intentional type coercion

		return html`
			<option key=${k} value=${k} selected=${selected}>
				${o.label}
			</option>`;
		}
	);
}

function arrayOfUndefined(n) {
	const a = [];

	for (let i = 0; i < n; i++) {
		a.push(undefined);
	}

	return a;
}
