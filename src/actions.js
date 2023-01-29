module.exports = {
	/**
	 * INTERNAL: Get the available actions.
	 */
	getActions() {
		let actions = {}

		actions['document'] = {
			label: 'Document Actions',
			options: [
				{
					type: 'textinput',
					label: 'Document (index or API endpoint)',
					id: 'document',
					tooltip: 'Enter an index number, document ID or API endpoint',
					default: '1',
					regex: `/${this.REGEX_DOCUMENT}/`,
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: this.CHOICES_DOCUMENTACTIONS,
					default: 'setLive',
				},
			],
			callback: (action, bank) => {
				const opt = action.options
				//this.debug('Action options', opt)
				const doc = this.getDocument(opt.document)
				this.sendGetRequest('documents/' + doc.id + '/' + opt.action)
			},
		}

		actions['layer'] = {
			label: 'Layer Actions',
			options: [
				{
					type: 'textinput',
					label: 'Layer (documentIndex,layerIndex or API endpoint)',
					id: 'endpoint',
					default: '',
					tooltip: 'Enter the doc,layer index or API endpoint from the layer to control',
					regex: `/${this.REGEX_LAYER}/`,
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: this.CHOICES_LAYERACTIONS,
					default: 'setLive',
				},
			],
			callback: (action, bank) => {
				let opt = action.options
				//this.debug('Action options', opt)
				const layer = this.getLayer(opt.endpoint)
				this.sendGetRequest(`documents/${layer.document}/layers/${layer.id}/${opt.action}`)
			},
		}

		actions['variant'] = {
			label: 'Variant Actions',
			options: [
				{
					type: 'textinput',
					label: 'API Endpoint',
					id: 'endpoint',
					default: '',
					tooltip: 'Enter the API endpoint from the variant to control',
					regex: `/${this.REGEX_VARIANT}/`,
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: this.CHOICES_VARIANTACTIONS,
					default: 'setLive',
				},
			],
			callback: (action, bank) => {
				let opt = action.options
				//this.debug('Action options', opt)
				this.sendGetRequest(opt.endpoint + '/' + opt.action)
			},
		}

		actions['layerSet'] = {
			label: 'Layer Set Recall',
			options: [
				{
					type: 'textinput',
					label: 'API Endpoint',
					id: 'endpoint',
					default: '',
					tooltip: 'Enter the API endpoint from the layer to control',
					regex: `/${this.REGEX_LAYERSET}/`,
				},
			],
			callback: (action, bank) => {
				this.sendGetRequest(action.options.endpoint + '/recall')
			},
		}

		actions['output'] = {
			label: 'Output Actions',
			options: [
				{
					type: 'textinput',
					label: 'API Endpoint',
					id: 'endpoint',
					default: '',
					tooltip: 'Enter the API endpoint from the layer to control',
					regex: `/${this.REGEX_OUTPUT}/`,
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: this.CHOICES_OUTPUTACTIONS,
					default: 'setLive',
				},
			],
			callback: (action, bank) => {
				const opt = action.options
				if (opt.action == 'toggleLive') {
					output = this.getOutput(opt.endpoint)
					switch (output.liveState) {
						case 'live':
							this.sendGetRequest(opt.endpoint + '/setOff')
							break
						case 'preview':
							this.sendGetRequest(opt.endpoint + '/setLive')
							break
					}
					return
				}

				this.sendGetRequest(opt.endpoint + '/' + opt.action)
			},
		}

		return actions
	},
}
