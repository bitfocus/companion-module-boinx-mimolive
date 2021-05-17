exports.defineFeedbacks = function () {
	const feedbacks = {}

	const foregroundColor = {
		type: 'colorpicker',
		label: 'Foreground colour',
		id: 'fg',
		default: this.rgb(255, 255, 255),
	}

	const styleLive = {
		color: this.rgb(255, 255, 255),
		bgcolor: this.rgb(255, 0, 0),
	}

	const stylePreview = {
		color: this.rgb(255, 255, 255),
		bgcolor: this.rgb(0, 165, 44),
	}

	const backgroundColorLive = {
		type: 'colorpicker',
		label: 'Background colour (shutdown)',
		id: 'bgs',
		default: this.rgb(255, 0, 0),
	}

	const backgroundColorStop = {
		type: 'colorpicker',
		label: 'Background colour (shutdown)',
		id: 'bgs',
		default: this.rgb(255, 152, 0),
	}

	const backgroundColorStart = {
		type: 'colorpicker',
		label: 'Background colour (starting)',
		id: 'bgs',
		default: this.rgb(255, 152, 0),
	}

	const backgroundColorPreview = {
		type: 'colorpicker',
		label: 'Background colour (preview)',
		id: 'bgp',
		default: this.rgb(0, 165, 44),
	}

	const backgroundColorOff = {
		type: 'colorpicker',
		label: 'Background colour (off)',
		id: 'bgo',
		default: this.rgb(0, 0, 0),
	}

	const backgroundColorActive = {
		type: 'colorpicker',
		label: 'Background colour',
		id: 'bga',
		default: this.rgb(0, 51, 204),
	}

	feedbacks.documentStatus = {
		type: 'boolean',
		label: 'Document status',
		description: 'Change the style based on the status of a document',
		options: [
			{
				type: 'textinput',
				label: 'Document (index or API endpoint)',
				id: 'document',
				tooltip: 'Enter an index number, document ID or API endpoint',
				default: '1',
				regex: this.REGEX_DOCUMENT,
			},
			{
				type: 'dropdown',
				label: 'Status',
				id: 'status',
				default: 'live',
				choices: [
					{ id: 'live', label: 'Live' },
					{ id: 'shutdown', label: 'Shutdown' },
					{ id: 'off', label: 'Off' },
				],
			},
		],
		style: styleLive,
		callback: ({ options }, bank) => {
			const doc = this.getDocument(options.document)
			//this.debug('Feedback - Document:', doc)
			if (doc) {
				return options.status === doc.liveState
			}
		},
	}

	feedbacks.layerStatus = {
		type: 'boolean',
		label: 'Layer status',
		description: 'Change the style based on the status of a layer',
		options: [
			{
				type: 'textinput',
				label: 'Layer (documentIndex,layerIndex or API endpoint)',
				id: 'layer',
				tooltip: "Enter document/layer index numbers, or layer's API endpoint",
				default: '1,1',
				regex: this.REGEX_LAYER,
			},
			{
				type: 'dropdown',
				label: 'Status',
				id: 'status',
				default: 'live',
				choices: [
					{ id: 'live', label: 'Live' },
					//{ id: 'preview', label: 'Preview' },
					{ id: 'shutdown', label: 'Shutdown' },
					{ id: 'off', label: 'Off' },
				],
			},
		],
		style: styleLive,
		callback: ({ options }, bank) => {
			const layer = this.getLayer(options.layer)
			//this.debug('Feedback - Layer:', layer)
			if (layer) {
				return options.status === layer.liveState
			}
		},
	}

	feedbacks.layerSetStatus = {
		type: 'boolean',
		label: 'Layer Set active',
		description: 'Change the style when a layer set is active',
		style: {
			color: this.rgb(255, 255, 255),
			bgcolor: this.rgb(0, 51, 204),
		},
		options: [
			{
				type: 'textinput',
				label: 'API endpoint',
				id: 'endpoint',
				tooltip: "Enter layer set's API endpoint",
				default: '',
				regex: this.REGEX_LAYERSET,
			},
		],
		callback: ({ options }, bank) => {
			const layerSet = this.getLayerSet(options.endpoint)
			if (layerSet.active) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks.outputStatus = {
		type: 'boolean',
		label: 'Output status',
		description: 'Change the style based on the status of an output',
		options: [
			{
				type: 'textinput',
				label: 'API endpoint',
				id: 'output',
				tooltip: "Enter output's API endpoint",
				default: '',
				regex: this.REGEX_OUTPUT,
			},
			{
				type: 'dropdown',
				label: 'Status',
				id: 'status',
				default: 'live',
				choices: [
					{ id: 'live', label: 'Live' },
					{ id: 'preview', label: 'Preview' },
					{ id: 'startup', label: 'Startup' },
					{ id: 'off', label: 'Off' },
				],
			},
		],
		style: styleLive,
		callback: ({ options }, bank) => {
			const output = this.getOutput(options.output)
			//			this.debug('Feedback - Output:', output)
			if (output) {
				return options.status === output.liveState
			}
		},
	}

	return feedbacks
}
