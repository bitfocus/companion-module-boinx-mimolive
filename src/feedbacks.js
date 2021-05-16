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

	const backgroundColorStopping = {
		type: 'colorpicker',
		label: 'Background colour (shutdown)',
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
			backgroundColorStopping,
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
			backgroundColorStopping,
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
			backgroundColorPreview,
		],
		callback: ({ options }, bank) => {
			const output = this.getOutput(options.output)
			//			this.debug('Feedback - Output:', output)
			if (output) {
				switch (output.liveState) {
					case 'live':
						return { color: options.fg, bgcolor: options.bgl }
					case 'preview':
						return { color: options.fg, bgcolor: options.bgp }
				}
			}
		},
	}

	feedbacks.layerSetStatus = {
		label: 'Layer Set status',
		description: 'Set colour based on the active status of a layer set',
		options: [
			{
				type: 'textinput',
				label: 'API endpoint',
				id: 'endpoint',
				tooltip: "Enter layer set's API endpoint",
				default: '',
				regex: this.REGEX_LAYERSET,
			},
			foregroundColor,
			backgroundColorActive,
		],
		callback: ({ options }, bank) => {
			const layerSet = this.getLayerSet(options.endpoint)
			if (layerSet.active) {
				return { color: options.fg, bgcolor: options.bga }
			}
		},
	}

	return feedbacks
}
