import { html } from 'htm/preact';
import { useState } from 'preact/hooks';

export const config = {
	wheels: [
		{label: '700c x 38mm', diameterIn: 27.32},
		{label: '26 x 1.5"', diameterIn: 24.87},
	]
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

	return html`<form>
		<label>
			Wheel size
			<${Select} 
				name="wheelSize"
				options=${config.wheels}
				optionKey="diameterIn"
				selectedKey=${wheelSize}
				onchange=${v => setWheelSize(v)}
			/>
		</label>
		<label>
			Chainring
			<input name="chainringTeeth"
				   value=${chainringTeeth} 
				   onchange=${e => {
					   debugger;
					   return setChainringTeeth(e.target.value);
				   }} />
		</label>
		<label>
			Cog
			<input name="cogTeeth"
				   value=${cogTeeth}
				   onchange=${e => setCogTeeth(e.target.value)} />
		</label>
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
			name=${props.name}
			onchange=${e => props.onchange(e.target.value)}
		>
			${options}
		</select>`;
}


export function App() {
    return html`<${BikeForm} />`;
}