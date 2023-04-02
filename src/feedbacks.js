import { combineRgb } from '@companion-module/base'

export default {
	defineFeedbacks: function () {
		const feedbacks = {}

		const styleLive = {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		}

		const stylePreview = {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 165, 44),
		}

		const styleActive = {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 204),
		}

		feedbacks.documentStatus = {
			type: 'boolean',
			name: 'Document status',
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
			defaultStyle: styleLive,
			callback: ({ options }) => {
				const doc = this.getDocument(options.document)
				//this.debug('Feedback - Document:', doc)
				if (doc) {
					return options.status === doc.liveState
				}
				return false
			},
		}

		feedbacks.layerStatus = {
			type: 'boolean',
			name: 'Layer status',
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
			defaultStyle: styleLive,
			callback: ({ options }) => {
				const layer = this.getLayer(options.layer)
				//this.debug('Feedback - Layer:', layer)
				if (layer) {
					return options.status === layer.liveState
				}
				return false
			},
		}

		feedbacks.variantStatus = {
			type: 'boolean',
			name: 'Variant status',
			description: 'Change the style based on the status of a variant',
			options: [
				{
					type: 'textinput',
					label: 'API endpoint',
					id: 'variant',
					tooltip: "Enter variant's API endpoint",
					default: '',
					regex: this.REGEX_VARIANT,
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
			defaultStyle: styleLive,
			callback: ({ options }) => {
				const variant = this.getVariant(options.variant)
				// this.debug('Feedback - Variant:', variant)
				if (variant) {
					return options.status === variant.liveState
				}
				return false
			},
		}

		feedbacks.layerSetStatus = {
			type: 'boolean',
			name: 'Layer Set active',
			description: 'Change the style when a layer set is active',
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
			defaultStyle: styleActive,
			callback: ({ options }) => {
				const layerSet = this.getLayerSet(options.endpoint)
				if (layerSet.active) {
					return true
				}
				return false
			},
		}

		feedbacks.outputStatus = {
			type: 'boolean',
			name: 'Output status',
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
			defaultStyle: styleLive,
			callback: ({ options }) => {
				const output = this.getOutput(options.output)
				//			this.debug('Feedback - Output:', output)
				if (output) {
					return options.status === output.liveState
				}
				return false
			},
		}

		return feedbacks
	},
}
