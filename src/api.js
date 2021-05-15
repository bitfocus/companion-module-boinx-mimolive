const WebSocket = require('ws')

exports.initAPI = function () {
	if (this.socket) {
		this.socket.close()
		delete this.socket
	}

	const retrySocket = () => {
		const ws = this.socket

		// ping server every 15 seconds to keep connection open
		try {
			// readyState 2 = CLOSING, readyState 3 = CLOSED
			if (!ws || ws.readyState == 2 || ws.readyState == 3) {
				if (this.config.host && this.config.host !== '') {
					startSocket()
				}
			}
			// readyState 1 = OPEN
			else if (ws.readyState == 1) {
				ws.send('keep alive')
			}
		} catch (err) {
			this.log('debug', 'Error with handling socket' + JSON.stringify(err))
		}
	}

	/**
	 * Create a WebSocket connection
	 */
	const startSocket = () => {
		const url = 'ws://' + this.config.host + ':' + this.port + '/api/v1/socket'
		this.debug('Connecting to server', url)
		this.debug('New websocket')
		this.socket = new WebSocket(url)

		this.socket.on('open', () => {
			this.status(this.STATUS_OK, 'Connected')
			this.log('debug', 'Connection to websocket established')
			this.sendGetRequest('documents')
		})

		this.socket.on('message', (msg) => {
			const message = JSON.parse(msg)
			this.debug('Message received:', message.type, message.event)
			let parentDocument

			switch (message.type) {
				case 'documents':
					//this.debug('Document:', message)
					const docIndex = this.documents.findIndex((doc) => doc.id === message.id)
					switch (message.event) {
						case 'added':
							this.log('debug', 'Document added:' + message.data.attributes.name)
							// Check the document doesn't already exist
							if (!this.documents.find((element) => element.id === message.id)) {
								this.documents.push({
									id: message.id,
									label: message.data.attributes.name,
									liveState: message.data.attributes['live-state'],
									layers: [],
									layerSets: [],
									outputs: [],
								})
								this.sendGetRequest(`documents/${message.id}/layers`)
							}
							this.updateVariableDefinitions()
							break
						case 'changed':
							this.log('debug', 'Document changed: ' + message.data.attributes.name)

							if (docIndex >= 0) {
								this.documents[docIndex].label = message.data.attributes.name
								this.documents[docIndex].liveState = message.data.attributes['live-state']

								//this.debug('Changed document:', this.documents[docIndex])
								this.updateStatusVariables(docIndex)
								this.checkFeedbacks('documentStatus')
							}
							break
						case 'removed':
							this.log('debug', 'Document removed')
							this.clearLayerVariables(docIndex) // Clear out variables before we remove them
							this.documents.splice(docIndex, 1)
							this.updateVariableDefinitions()
							this.checkFeedbacks('documentStatus')
							break
					}
					break

				case 'layers':
					//this.debug('Message payload:', message)
					let layerIndex
					switch (message.event) {
						case 'added':
						case 'changed':
							let parentDocument = this.documents.find(
								(element) => element.id === message.data.relationships.document.data.id
							)
							layerIndex = message.data.attributes.index
							if (parentDocument.layers[layerIndex] == undefined) {
								parentDocument.layers[layerIndex] = {
									id: message.id,
									label: message.data.attributes.name,
									document: parentDocument.id,
									variants: [],
									activeVariant: message.data.relationships['active-variant'].data.id,
									liveState: message.data.attributes['live-state'],
								}
							} else {
								parentDocument.layers[layerIndex].id = message.id
								parentDocument.layers[layerIndex].label = message.data.attributes.name
								parentDocument.layers[layerIndex].activeVariant = message.data.relationships['active-variant'].data.id
								parentDocument.layers[layerIndex].liveState = message.data.attributes['live-state']
							}
							this.debug('Layer:', message.data.attributes.name, 'is', message.data.attributes['live-state'])
							this.updateLayerVariables()
							this.checkFeedbacks('layerStatus')
							break
						case 'removed':
							for (doc in this.documents) {
								this.debug('doc:', doc, typeof doc)
								let layerIndex = this.documents[doc].layers.findIndex((element) => element.id === message.id)
								if (layerIndex >= 0) {
									this.clearLayerVariables(parseInt(doc), layerIndex) // Clear out variable before we remove them
									this.documents[doc].layers.splice(layerIndex, 1)
									this.checkFeedbacks('layerStatus')
									this.updateVariableDefinitions()
								}
							}
							break
					}
					break

				case 'variants':
					switch (message.event) {
						case 'added':
						case 'changed':
							break
						case 'removed':
							break
					}
					break

				case 'layer-sets':
					//this.debug('Message payload:', message)
					switch (message.event) {
						case 'added':
						case 'changed':
							let parentDocument = this.documents.find(
								(element) => element.id === message.data.relationships.document.data.id
							)
							let setIndex = parentDocument.layerSets.findIndex((e) => e.id === message.id)
							if (setIndex >= 0) {
								parentDocument.layerSets.splice(setIndex, 1)
							}
							parentDocument.layerSets.push({
								id: message.id,
								label: message.data.attributes.name,
								active: message.data.attributes.active,
							})
							this.checkFeedbacks('layerSetStatus')
							break
						case 'removed':
							for (doc in this.documents) {
								let setIndex = this.documents[doc].layerSets.findIndex((element) => element.id === message.id)
								if (setIndex >= 0) {
									this.documents[doc].layers.splice(setIndex, 1)
									this.checkFeedbacks('layerSetStatus')
								}
							}
							break
					}
					break

				case 'output-destinations':
					//this.debug('Message payload:', message)
					switch (message.event) {
						case 'added':
						case 'changed':
							const parentDocument = this.documents.find(
								(element) => element.id === message.data.relationships.document.data.id
							)
							//							this.debug('parentDocument', parentDocument)
							let outputIndex = parentDocument.outputs.findIndex((output) => output.id === message.id)
							//							this.debug('OutputIndex:', outputIndex)
							if (outputIndex >= 0) {
								parentDocument.outputs.splice(outputIndex, 1)
							}
							parentDocument.outputs.push({
								id: message.id,
								label: message.data.attributes.title,
								ready: message.data.attributes['ready-to-go-live'],
								liveState: message.data.attributes['live-state'],
							})
							this.checkFeedbacks('outputStatus')
							break
						case 'removed':
							for (doc in this.documents) {
								this.debug('doc:', doc, typeof doc)
								let outputIndex = this.documents[doc].outputs.findIndex((element) => element.id === message.id)
								if (outputIndex >= 0) {
									this.documents[doc].layers.splice(outputIndex, 1)
									this.checkFeedbacks('outputStatus')
								}
							}
							break
					}
					break
			}
		})

		this.socket.on('close', () => {
			this.log('debug', 'Connection to websocket closed')
			this.status(this.STATUS_ERROR, 'Waiting')
		})

		this.socket.on('error', (err) => {
			this.status(this.STATUS_ERROR, err)
			this.log('error', 'Schedule Websocket API err:' + JSON.stringify(err))
		})
	}

	this.pollApi = setInterval(retrySocket, 15000)
	retrySocket()
}

/**
 * Send a REST GET request to the player and handle errorcodes
 * @param  {} cmd
 */
exports.sendGetRequest = function (cmd) {
	if (cmd.startsWith(this.apiSlug) == false) {
		cmd = this.apiSlug + cmd
	}
	let url = `http://${this.config.host}:${this.port}${cmd}`
	this.debug('REST GET:', url)
	this.system.emit('rest_get', url, processResult.bind(this))
}

/**
 * INTERNAL: Callback for REST calls to process the return
 *
 * @param {?boolean} err - null if a normal result, true if there was an error
 * @param {Object} result - data: & response: if normal; error: if error
 * @private
 * @since 1.0.0
 */
processResult = function (err, result) {
	if (err !== null) {
		if (result.error.code !== undefined) {
			this.log('error', 'Connection failed (' + result.error.code + ')')
		} else {
			this.log('error', 'general HTTP failure')
		}
		this.status(this.STATUS_ERROR, 'NOT CONNECTED')
		if (this.pollingActive === 1) {
			debug('Error Count:', this.errorCount)
			this.errorCount++
		}
		if (this.errorCount > 10) {
			this.setupConnectivtyTester()
		}
		return
	}

	switch (result.response.statusCode) {
		case 200: // OK
			this.status(this.STATUS_OK)
			const message = JSON.parse(result.data)
			//			this.debug('Return data:', message);
			const cmd = message.links.self.slice(8)
			this.debug('Sent cmd:', cmd)

			processData.bind(this)(cmd, message.data)
			break
		case 404: // Not found
			//			this.status(this.STATUS_WARNING, 'Not found: ' + result.data.error)
			this.log('warning', 'Not found: ' + result.data.error)
			break
		default:
			// Unexpenses response
			this.status(this.STATUS_ERROR, 'Unexpected HTTP status code: ' + result.response.statusCode)
			this.log('error', 'Unxspected HTTP status code: ' + result.response.statusCode)
			break
	}
}

/**
 * Process incoming data from the websocket connection
 * @param  {string} cmd - the path passed to the API
 * @param  {Object} data - response data
 */
processData = function (cmd, data) {
	//	this.debug('Sent cmd:',cmd);
	//	this.debug('Return data:',data);

	if (cmd == 'documents') {
		this.documents = []
		for (i in data) {
			this.documents.push({
				id: data[i].id,
				label: data[i].attributes.metadata.title,
				liveState: data[i].attributes['live-state'],
				layers: [],
				layerSets: [],
				outputs: [],
			})
			this.sendGetRequest(`documents/${data[i].id}/layers`)
			this.sendGetRequest(`documents/${data[i].id}/layer-sets`)
			this.sendGetRequest(`documents/${data[i].id}/output-destinations`)
			//		this.updateStatusVariables(data)
			//			this.debug('Document:', this.documents[i])
			this.actions()
		}
		this.updateVariableDefinitions()
		this.checkFeedbacks('documentStatus')
		return
	}

	if (cmd.endsWith('/layers')) {
		//		this.debug('Layers:', data)
		const parentDocId = RegExp(/^documents\/(\d+)\/layers$/).exec(cmd)[1]
		const parentDoc = this.documents.find((element) => element.id === parentDocId)
		//		this.debug('Doc ID:', parentDocId)
		//		this.debug(data)
		for (layer in data) {
			this.debug('Building Layer:', data[layer].relationships)
			let index = data[layer].attributes.index
			parentDoc.layers[index] = {
				id: data[layer].id,
				label: data[layer].attributes.name,
				document: parentDoc.id,
				variants: [],
				activeVariant: data[layer].relationships['active-variant'].data.id,
				//				liveVariant: data[layer].relationships['live-variant'].data.id,
				liveVariant: '',
				liveState: data[layer].attributes['live-state'],
			}
			this.sendGetRequest(`documents/${parentDocId}/layers/${data[layer].id}/variants`)
		}
		//		this.debug('Layers:', parentDoc)
		this.updateVariableDefinitions()
		this.checkFeedbacks('layerStatus')
		return
	}

	if (cmd.endsWith('/variants')) {
		//		this.debug('Variants:', data)
		let allIDs = RegExp(/^documents\/(\d+)\/layers\/([0-9-A-Z]+)\/variants$/).exec(cmd)
		const parentDocId = allIDs[1]
		const layerId = allIDs[2]
		const parentDoc = this.documents.find((element) => element.id === parentDocId)
		const parentLayer = parentDoc.layers.find((element) => element.id === layerId)
		//		this.debug('Doc ID:', parentDocId)
		//		this.debug(data)
		for (variant in data) {
			this.debug('Variant:', variant)
			parentLayer.variants.push({
				id: data[variant].id,
				label: data[variant].attributes.name,
				liveState: data[variant].attributes['live-state'],
			})
		}
		// this.debug('Layers:', parentDoc)
		this.updateVariableDefinitions()
		this.checkFeedbacks('variantStatus')
		return
	}

	if (cmd.endsWith('/layer-sets')) {
		//		this.debug('Layers:', data)
		const parentDocId = RegExp(/^documents\/(\d+)\/layer-sets$/).exec(cmd)[1]
		const parentDoc = this.documents.find((element) => element.id === parentDocId)
		//		this.debug('Doc ID:', parentDocId)
		//		this.debug(data)
		for (layerSet in data) {
			//			this.debug('Layer Set:', data[layerSet])
			parentDoc.layerSets.push({
				id: data[layerSet].id,
				label: data[layerSet].attributes.name,
				active: data[layerSet].attributes['active'],
			})
		}
		//		this.debug('Layers:', parentDoc)
		this.checkFeedbacks('layerSetStatus')
		return
	}

	if (cmd.endsWith('/output-destinations')) {
		//		this.debug('Layers:', data)
		const parentDocId = RegExp(/^documents\/(\d+)\/output-destinations$/).exec(cmd)[1]
		const parentDoc = this.documents.find((element) => element.id === parentDocId)
		//		this.debug('Doc ID:', parentDocId)
		//		this.debug(data)
		for (output in data) {
			//			this.debug('Output:', data[output])
			parentDoc.outputs.push({
				id: data[output].id,
				label: data[output].attributes.title,
				ready: data[output].attributes['ready-to-go-live'],
				liveState: data[output].attributes['live-state'],
			})
		}
		//		this.debug('Layers:', parentDoc)
		this.checkFeedbacks('outputStatus')
		return
	}
}
