import { html } from 'htm/preact';
import { useState, useId } from 'preact/hooks';

export const config = {
	wheels: [
		{label: '700c x 38mm', diameterIn: 27.32},
		{label: '26 x 1.5"', diameterIn: 24.87},
	]
}

export function MultiBikeForm() {
	const [lastKey, setLastKey] = useState(1);
	const [keys, setKeys] = useState([lastKey]);

	function add() {
		const k = lastKey + 1;
		setKeys([...keys, k]);
		setLastKey(k);
	}

	function remove(keyToRemove) {
		setKeys(keys.filter(key => key !== keyToRemove));
	}

	return html`
		<div>
			${keys.map(key => html`
				<div key=${key}>
					<${BikeForm}/>
					<button onclick=${() => remove(key)}>Remove</button>
				</div>
			`)}
			<button onclick=${add}>Add Bike</button>
		</div>`;
}

export function BikeForm() {
	const [wheelSize, setWheelSize] = useState(config.wheels[0].diameterIn);
	const [chainringTeeth, setChainringTeeth] = useState();
	const [cogTeeth, setCogTeeth] = useState();

	// TODO: better validation. This accepts decimal values.
	let nChainringTeeth = parseInt(chainringTeeth, 10);
	let nCogTeeth = parseInt(cogTeeth, 10);
	let gearInches;

	if (isNaN(nChainringTeeth) || isNaN(nCogTeeth)) {
		gearInches = '';
	} else {
		gearInches = wheelSize * nChainringTeeth / nCogTeeth;
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
						selectedKey=${wheelSize}
						onchange=${v => setWheelSize(v)}
					/>
				</td>
			</tr>
			<tr>
				<td><label for=${chainringId}>Chainring</label></td>
				<td>
					<input 
						id=${chainringId} 
						name="chainringTeeth" 
						value=${chainringTeeth} 
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
						value=${cogTeeth}
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