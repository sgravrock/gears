import { html } from 'htm/preact';
import { useState, useId } from 'preact/hooks';

export const config = {
	wheels: [
		{label: '700c x 38mm', diameterIn: 27.32},
		{label: '26 x 1.5"', diameterIn: 24.87},
	]
};

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
	const paramToKey = {ws: 'wheelSize', cr: 'chainring', cg: 'cog'};

	// TODO: error reporting
	for (const [k, v] of new URLSearchParams(queryString)) {
		const m = k.match(/^(ws|cr|cg)([0-9]+)$/);

		if (m) {
			const id = parseInt(m[2], 10);
			const nv = parseFloat(v);

			if (!isNaN(id) && !isNaN(nv)) {
				if (!byId[id]) {
					byId[id] = {id};
				}

				byId[id][paramToKey[m[1]]] = nv;
			}
		}
	}

	if (Object.keys(byId).length === 0) {
		return [{id: 0, wheelSize: config.wheels[0].diameterIn}];
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
		params.push([`cr${b.id}`, b.chainring]);
		params.push([`cg${b.id}`, b.cog]);
	}

	// Omit params that haven't been set yet
	params = params.filter(p => !!p[1]);
	return '?' + new URLSearchParams(params).toString();
}

function newBkeWithId(id) {
	return {id, wheelSize: config.wheels[0].diameterIn.toString()};
}

export function MultiBikeForm(props) {
	function add() {
		const k = maxKey(props.bikes) + 1;
		props.setBikes([...props.bikes, newBkeWithId(k)]);
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
	// TODO: better validation. This accepts decimal values.
	let nChainringTeeth = parseInt(props.bike.chainring, 10);
	let nCogTeeth = parseInt(props.bike.cog, 10);
	let gearInches;

	if (isNaN(nChainringTeeth) || isNaN(nCogTeeth)) {
		gearInches = '';
	} else {
		gearInches = Math.round(10 * props.bike.wheelSize * nChainringTeeth / nCogTeeth) / 10;
	}

	function setWheelSize(wheelSize) {
		props.setBike({...props.bike, wheelSize});
	}

	function setChainring(chainring) {
		props.setBike({...props.bike, chainring})
	}

	function setCog(cog) {
		props.setBike({...props.bike, cog})
	}

	const wheelSizeId = useId();
	const chainringId = useId();
	const cogId = useId();

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
				<td><label for=${cogId}>Cog</label></td>
				<td>
					<input
						id=${cogId}
						name="cog"							
						value=${props.bike.cog}
						onchange=${e => setCog(e.target.value)}
						size="2"
					/>
				</td>
			</tr>
		</table>
		<div class="result">${gearInches && `${gearInches} inches`}</div>
	</form>`;
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