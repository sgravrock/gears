import {Fragment} from 'preact';
import {html} from 'htm/preact';
import {useId, useState} from 'preact/hooks';

export const config = {
	defaultWheelSize: 24.87,
	maxNumChainrings: 3,
	maxNumCogs: 13,
	units: [
		{label: 'Gear inches', id: 'gi'},
		{label: 'MPH @ 60 RPM', id: 'mph60'},
		{label: 'MPH @ 90 RPM', id: 'mph90'},
	],
	wheelGroups: [
		{
			label: "29\" / fat 700c",
			options: [
				{
					label: "29 x 3.0\" / 75-622",
					diameterIn: "29.90"
				},
				{
					label: "29 x 2.7\" / 70-622",
					diameterIn: "29.54"
				},
				{
					label: "29 x 2.3\" / 60-622",
					diameterIn: "28.94"
				},
				{
					label: "29 x 2.2\" / 700c X 56mm / 56-622",
					diameterIn: "29.13"
				},
				{
					label: "29 x 2.1\" / 54-622",
					diameterIn: "29.03"
				},
				{
					label: "29 x 2.0\" / 700c X 50mm / 50-622",
					diameterIn: "28.94"
				},
				{
					label: "29 x 1.9\" / 47-622",
					diameterIn: "27.33"
				},
			]
		},
		{
			label: "700c",
			options: [
				{
					label: "700c X 44mm / 44-622 / 29 x 1.75",
					diameterIn: "27.86"
				},
				{
					label: "700c X 38mm / 38-622",
					diameterIn: "27.32"
				},
				{
					label: "700c X 35mm / 35-622",
					diameterIn: "27.17"
				},
				{
					label: "700c X 32mm / 32-622",
					diameterIn: "27"
				},
				{
					label: "700c X 25mm / 25-622",
					diameterIn: "26.38"
				},
				{
					label: "700c X 23mm / 23-622",
					diameterIn: "26.28"
				},
				{
					label: "700c X 20mm / 20-622",
					diameterIn: "26.14"
				},
			]
		},
		{
			label: "650b / 27.5\"",
			options: [
				{
					label: "650b x 3.0\" / 76-584",
					diameterIn: "28.68"
				},
				{
					label: "650b x 2.8\" / 71-584",
					diameterIn: "28.48"
				},
				{
					label: "650b x 2.5\" / 64-584",
					diameterIn: "28.18"
				},
				{
					label: "650b x 2.0\" / 51-584",
					diameterIn: "27.68"
				},
				{
					label: "650b x 38mm / 38-584",
					diameterIn: "26.00"
				},
			]
		},
		{
			label: "26\"",
			options: [
				{
					label: "26 inch (nominal)",
					diameterIn: "26"
				},
				{
					label: "26 X 2.35\" / 60-559",
					diameterIn: "26.41"
				},
				{
					label: "26 X 2.125\" / 54-559",
					diameterIn: "25.94"
				},
				{
					label: "26 X 1.9\" / 47-559",
					diameterIn: "25.75"
				},
				{
					label: "26 X 1.5\" / 38-559",
					diameterIn: "24.87"
				},
				{
					label: "26 X 1.25\" / 32-559",
					diameterIn: "24.47"
				},
				{
					label: "26 X 1.0\" / 25-559",
					diameterIn: "23.97"
				},
				{
					label: "26 X 1 3/8\" / 35-590",
					diameterIn: "25.91"
				},
			]
		},
		{
			label: "Fat bikes",
			options: [
				{
					label: "26 x 4.7\" / 119-559 fatbike at 10 PSI",
					diameterIn: "29.97"
				},
				{
					label: "26 x 4.25\" / 108-559 fatbike at 10 PSI",
					diameterIn: "29.07"
				},
				{
					label: "26 x 4.0\" / 102-559 fatbike at 10 PSI",
					diameterIn: "28.57"
				},
				{
					label: "26 x 3.8 \"/ 97-559 fatbike at 10 PSI",
					diameterIn: "28.17"
				},
			]
		},
		{
			label: "Small wheels",
			options: [
				{
					label: "24 inch (nominal)",
					diameterIn: "24"
				},
				{
					label: "24 x 1\" / 25-520",
					diameterIn: "21.97"
				},
				{
					label: "24 x 2.5\" / 65-507",
					diameterIn: "24.35"
				},
				{
					label: "24 x 2/3\" / 60-507",
					diameterIn: "24.15"
				},
				{
					label: "24 x 2.1\" / 54-507",
					diameterIn: "23.95"
				},
				{
					label: "20 x 1 3/8\" / 32-451",
					diameterIn: "20.15"
				},
				{
					label: "20 x 1 1/8\" / 28-451",
					diameterIn: "19.90"
				},
				{
					label: "20 X 1.75\" / 44-406",
					diameterIn: "18.68"
				},
				{
					label: "20 X 1.25\" / 32-406",
					diameterIn: "18.43"
				},
				{
					label: "18 x 1.5\" / 40-355",
					diameterIn: "17.16"
				},
				{
					label: "17 x 1 1/4\" / 32-369",
					diameterIn: "16.60"
				},
				{
					label: "16 x 1 1/2\" / 40-349",
					diameterIn: "16.88"
				},
				{
					label: "16 x 1 3/8\" / 35-349",
					diameterIn: "16.07"
				},
				{
					label: "16 x 1.5\" / 37-305",
					diameterIn: "14.92"
				}
			]
		},
		{
			label: "Obscure/niche/obsolete/silly sizes",
			options: [
				{
					label: "36 x 2.25\" / 57-787",
					diameterIn: "35.65"
				},
				{
					label: "32 x 2.125\" / 54/686",
					diameterIn: "30.94"
				},
				{
					label: "28 inch (nominal)",
					diameterIn: "28"
				},
				{
					label: "28 X 1 1/2\" / 40-635",
					diameterIn: "28.15"
				},
				{
					label: "Tubular / Wide",
					diameterIn: "26.53"
				},
				{
					label: "Tubular / Narrow",
					diameterIn: "26.38"
				},
				{
					label: "27 inch (nominal)",
					diameterIn: "27"
				},
				{
					label: "27 X 1 3/8\" / 35-630",
					diameterIn: "27.18"
				},
				{
					label: "27 X 1 1/4\" / 32-630",
					diameterIn: "27.08"
				},
				{
					label: "27 X 1 1/8\" / 28-630",
					diameterIn: "27"
				},
				{
					label: "27 X 1\" / 25-630",
					diameterIn: "26.88"
				},
				{
					label: "650c x 28mm / 28-571 / 26\" road/tri",
					diameterIn: "24.70"
				},
				{
					label: "650c x 25mm / 25-571 / 26\" road/tri",
					diameterIn: "24.46"
				},
				{
					label: "650c x 23mm / 23-571 / 26\" road/tri",
					diameterIn: "24.31"
				},
			]
		},
	],
};

export function newBike(id) {
	return {
		id,
		wheelSize: config.defaultWheelSize,
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
		params.push([`ws${b.id}`, b.wheelSize]);

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

	const result = calculate(unit, bike);

	const wheelSizeId = useId();

	return html`
		<tr>
			<td>
				<table class="bike-form">
					<tr>
						<td><label for=${wheelSizeId}>Wheel size</label></td>
						<td>
							<${Select}
								id=${wheelSizeId}
								name="wheelSize${bike.id}"
								optionGroups=${config.wheelGroups}
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
				${canRemove && html`<button onclick=${remove}>Remove</button>`}
			</td>
			<td>
				${result && html`<${ResultTable} result=${result} />`}
			</td>
		</tr>
	`;
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
			return chainrings.map(ring => ratio(unit, bike.wheelSize, ring, cog));
		})
	}
}

function ratio(unit, wheelSize, chainring, cog) {
	const gearInches = chainring / cog * wheelSize;

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

// Exactly one of options and optionGroups should be passed
export function Select({id, name, options, optionGroups,
						optionKey, selectedKey, onchange}) {
	let children;

	if (optionGroups) {
		console.log('using option groups:', optionGroups);
		// Option group labels come from static data so they make suitable keys
		children = optionGroups.map((g) => html`
			<optgroup key=${g.label} label=${g.label}>
				<${SelectOptions}
					options=${g.options}
					optionKey=${optionKey}
					selectedKey=${selectedKey}
				/>
			</optgroup>
		`);
		console.log('ok');
	} else {
		console.log('using options:', options);
		children = html`
			<${SelectOptions}
				options=${options}
				optionKey=${optionKey} 
				selectedKey=${selectedKey}
			/>`
		console.log('ok');
	}

	return html`
		<select
			id=${id}
			name=${name}
			onchange=${e => onchange(e.target.value)}
		>
			${children}
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
