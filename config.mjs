const config = {
	defaultTireSize: 24.87,
	maxNumChainrings: 3,
	maxNumCogs: 13,
	units: [
		{label: 'Gear inches', id: 'gi'},
		{label: 'MPH @ 60 RPM', id: 'mph60'},
		{label: 'MPH @ 90 RPM', id: 'mph90'},
	],
	tireGroups: [
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

export default config;