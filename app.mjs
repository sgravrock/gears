import { html } from 'htm/preact';
import { useState, useId } from 'preact/hooks';

export const config = {
	wheels: [
		{label: '700c x 38mm', diameterIn: 27.32},
		{label: '26 x 1.5"', diameterIn: 24.87},
	]
}

function newBkeWithId(id) {
	return {id, wheelSize: config.wheels[0].diameterIn.toString()};
}

export function MultiBikeForm() {
	const [lastKey, setLastKey] = useState(1);
	const [bikes, setBikes] = useState([newBkeWithId(lastKey)]);

	function add() {
		const k = lastKey + 1;
		setLastKey(k);
		setBikes([...bikes, newBkeWithId(k)]);
	}

	function replace(newBike, i) {
		const result = [...bikes];
		result[i] = newBike;
		setBikes(result);
	}

	function remove(bike) {
		setBikes(bikes.filter(b => b !== bike));
	}

	return html`
		<div>
			${bikes.map((b, i) => html`
				<div key=${b.id}>
					<${BikeForm} bike=${b} setBike=${nb => replace(nb, i)} />
					<button onclick=${() => remove(b)}>Remove</button>
				</div>
			`)}
			<button onclick=${add}>Add Bike</button>
		</div>`;
}

export function BikeForm(props) {
	// TODO: better validation. This accepts decimal values.
	let nChainringTeeth = parseInt(props.bike.chainringTeeth, 10);
	let nCogTeeth = parseInt(props.bike.cogTeeth, 10);
	let gearInches;

	if (isNaN(nChainringTeeth) || isNaN(nCogTeeth)) {
		gearInches = '';
	} else {
		gearInches = props.bike.wheelSize * nChainringTeeth / nCogTeeth;
	}

	function setWheelSize(wheelSize) {
		props.setBike({...props.bike, wheelSize});
	}

	function setChainringTeeth(chainringTeeth) {
		props.setBike({...props.bike, chainringTeeth})
	}

	function setCogTeeth(cogTeeth) {
		props.setBike({...props.bike, cogTeeth})
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
						name="chainringTeeth" 
						value=${props.bike.chainringTeeth} 
						onchange=${e => setChainringTeeth(e.target.value)}
						size="2"
					/>
				</td>
			</tr>
			<tr>
				<td><label for=${cogId}>Cog</label></td>
				<td>
					<input
						id=${cogId}
						name="cogTeeth"							
						value=${props.bike.cogTeeth}
						onchange=${e => setCogTeeth(e.target.value)}
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


export function App() {
    return html`<${MultiBikeForm} />`;
}