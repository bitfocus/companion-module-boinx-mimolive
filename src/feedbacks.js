exports.defineFeedbacks = function () {
	const feedbacks = {}

	const foregroundColor = {
		type: 'colorpicker',
		label: 'Foreground colour',
		id: 'fg',
		default: this.rgb(255, 255, 255),
	}

	const backgroundColorLive = {
		type: 'colorpicker',
		label: 'Background colour (live)',
		id: 'bgl',
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
		type: 'advanced',
		label: 'Document status',
		description: 'Set colour based on the live status of a document',
		options: [
			{
				type: 'textinput',
				label: 'Document (index or API endpoint)',
				id: 'document',
				tooltip: 'Enter an index number, document ID or API endpoint',
				default: '1',
				regex: this.REGEX_DOCUMENT,
			},
			foregroundColor,
			backgroundColorLive,
			backgroundColorStop,
		],
		callback: ({ options }, bank) => {
			const doc = this.getDocument(options.document)
			//			this.debug('Feedback - Document:', doc)
			if (doc) {
				switch (doc.liveState) {
					case 'live':
						return { color: options.fg, bgcolor: options.bgl }
					case 'shutdown':
						return { color: options.fg, bgcolor: options.bgs }
				}
			}
		},
	}

	feedbacks.layerStatus = {
		type: 'advanced',
		label: 'Layer status',
		description: 'Set colour based on the live status of a layer',
		options: [
			{
				type: 'textinput',
				label: 'Layer (documentIndex,layerIndex or API endpoint)',
				id: 'layer',
				tooltip: "Enter document/layer index numbers, or layer's API endpoint",
				default: '1,1',
				regex: this.REGEX_LAYER,
			},
			foregroundColor,
			backgroundColorLive,
			backgroundColorStop,
		],
		callback: ({ options }, bank) => {
			const layer = this.getLayer(options.layer)
			//			this.debug('Feedback - Layer:', layer)
			if (layer) {
				switch (layer.liveState) {
					case 'live':
						return { color: options.fg, bgcolor: options.bgl }
					case 'shutdown':
						return { color: options.fg, bgcolor: options.bgs }
				}
			}
		},
	}

	feedbacks.outputStatus = {
		type: 'advanced',
		label: 'Output status',
		description: 'Set colour based on the live status of an output',
		options: [
			{
				type: 'textinput',
				label: 'API endpoint',
				id: 'output',
				tooltip: "Enter output's API endpoint",
				default: '',
				regex: this.REGEX_OUTPUT,
			},
			foregroundColor,
			backgroundColorLive,
			backgroundColorStart,
			backgroundColorPreview,
		],
		callback: ({ options }, bank) => {
			const output = this.getOutput(options.output)
			//			this.debug('Feedback - Output:', output)
			if (output) {
				switch (output.liveState) {
					case 'live':
						return { color: options.fg, bgcolor: options.bgl }
					case 'startup':
						return { color: options.fg, bgcolor: options.bgs }
					case 'preview':
						return { color: options.fg, bgcolor: options.bgp }
				}
			}
		},
	}

	feedbacks.layerSetStatus = {
		type: 'boolean',
		label: 'Layer Set status',
		description: 'Set colour based on the active status of a layer set',
		style: {
			color: this.rgb(255, 255, 255),
			bgcolor: this.rgb(0, 51, 204)
		},
		options: [{
				type: 'textinput',
				label: 'API endpoint',
				id: 'endpoint',
				tooltip: "Enter layer set's API endpoint",
				default: '',
				regex: this.REGEX_LAYERSET,
			}],
		callback: ({ options }, bank) => {
			const layerSet = this.getLayerSet(options.endpoint)
			if (layerSet.active) {
				return true
			} else {
				return false
			}
		},
	}

	return feedbacks
}
