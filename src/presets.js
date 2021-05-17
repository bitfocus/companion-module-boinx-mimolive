exports.getPresets = function () {
	let presets = []
	const whiteColor = this.rgb(255, 255, 255)
	const blackColor = this.rgb(0, 0, 0)
	const previewFgColor = this.rgb(0, 204, 0)
	const previewBgColor = this.rgb(0, 153, 51)
	const startupColor = this.rgb(255, 152, 0)
	const shutdownColor = this.rgb(255, 152, 0)
	const liveColor = this.rgb(255, 0, 0)
	const activeColor = this.rgb(0, 51, 204)
	const offColor = this.rgb(68, 68, 68)

	/**
	 * Document
	 */
	presets.push({
		category: 'Document',
		label: 'Toggle Document',
		bank: {
			style: 'text',
			text: 'Start Show',
			size: '24',
			color: previewFgColor,
			bgcolor: blackColor,
		},
		actions: [
			{
				action: 'document',
				options: {
					document: '1',
					action: 'toggleLive',
				},
			},
		],
		feedbacks: [
			{
				type: 'documentStatus',
				options: {
					status: 'live',
				},
				style: {
					color: liveColor,
					text: 'Stop Show',
				},
			},
			{
				type: 'documentStatus',
				options: {
					status: 'shutdown',
				},
				style: {
					color: shutdownColor,
					text: 'Shut Down',
				},
			},
		],
	})

	presets.push({
		category: 'Document',
		label: 'Document State',
		bank: {
			style: 'text',
			text: `$(${this.shortname}:doc_1_status)`,
			size: '24',
			color: whiteColor,
			bgcolor: offColor,
		},
		actions: [
			{
				action: 'document',
				options: {
					document: '1',
					action: 'toggleLive',
				},
			},
		],
		feedbacks: [
			{
				type: 'documentStatus',
				options: {
					status: 'live',
				},
				style: {
					bgcolor: liveColor,
				},
			},
			{
				type: 'documentStatus',
				options: {
					status: 'shutdown',
				},
				style: {
					bgcolor: shutdownColor,
				},
			},
		],
	})

	/**
	 * Layer presets
	 */
	for (let doc = 1; doc <= 1; doc++) {
		for (let layer = 1; layer <= 20; layer++) {
			presets.push({
				category: `Layers`,
				label: `Layer ${layer}`,
				bank: {
					style: 'text',
					text: `$(${this.shortname}:layer_${doc}_${layer}_name)`,
					size: 'auto',
					color: whiteColor,
					bgcolor: blackColor,
				},
				actions: [
					{
						action: 'layer',
						options: {
							endpoint: `${doc},${layer}`,
							action: `toggleLive`,
						},
					},
				],
				feedbacks: [
					{
						type: 'layerStatus',
						options: {
							layer: `${doc},${layer}`,
							status: 'live',
						},
						style: {
							bgcolor: liveColor,
						},
					},
					/*{
						type: 'layerStatus',
						options: {
							layer: `${doc},${layer}`,
							status: 'preview'
						},
						style: {
							bgcolor: previewColor
						}
					},*/
					{
						type: 'layerStatus',
						options: {
							layer: `${doc},${layer}`,
							status: 'shutdown',
						},
						style: {
							bgcolor: shutdownColor,
						},
					},
				],
			})
		}
	}

	/**
	 * Layer set presets
	 */
	presets.push({
		category: `Layer Sets`,
		label: `Layer Set`,
		bank: {
			style: 'text',
			text: `Layer Set`,
			size: '24',
			color: whiteColor,
			bgcolor: blackColor,
		},
		actions: [
			{
				action: 'layerSet',
				options: {
					endpoint: ``,
				},
			},
		],
		feedbacks: [
			{
				type: 'layerSetStatus',
				options: {
					endpoint: ``,
				},
				style: {
					bgcolor: activeColor,
				},
			},
		],
	})

	/**
	 * Outputpresets
	 */
	presets.push({
		category: `Outputs`,
		label: `Output`,
		bank: {
			style: 'text',
			text: `Output`,
			size: '18',
			color: whiteColor,
			bgcolor: offColor,
		},
		actions: [
			{
				action: 'output',
				options: {
					endpoint: ``,
					action: 'toggleLive',
				},
			},
		],
		feedbacks: [
			{
				type: 'outputStatus',
				options: {
					endpoint: ``,
					status: 'live',
				},
				style: {
					bgcolor: liveColor,
				},
			},
			{
				type: 'outputStatus',
				options: {
					endpoint: ``,
					status: 'preview',
				},
				style: {
					bgcolor: previewBgColor,
				},
			},
			{
				type: 'outputStatus',
				options: {
					endpoint: ``,
					status: 'startup',
				},
				style: {
					bgcolor: startupColor,
				},
			},
		],
	})

	return presets
}
