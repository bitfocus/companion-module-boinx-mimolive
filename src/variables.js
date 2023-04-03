export default {
	/**
	 * Update the available static and dynamic variable definitions.
	 */
	updateVariableDefinitions: function () {
		const variables = []

		this.log('debug', 'Build document variables.')
		// document variables:
		this.documents.forEach((doc, docIndex) => {
			variables.push({
				name: `Document ${docIndex + 1} Name`,
				variableId: `doc_${docIndex + 1}_name`,
			})

			variables.push({
				name: `Document ${docIndex + 1} Status`,
				variableId: `doc_${docIndex + 1}_status`,
			})

			doc.layers.forEach((layer, index) => {
				variables.push({
					name: `Doc ${docIndex + 1} Layer ${index + 1} Name`,
					variableId: `layer_${docIndex + 1}_${index + 1}_name`,
				})
				variables.push({
					name: `Doc ${docIndex + 1} Layer ${index + 1} Active Variant`,
					variableId: `layer_${docIndex + 1}_${index + 1}_activeVariant`,
				})
				if (layer.volume != null) {
					variables.push({
						name: `Doc ${docIndex + 1} Layer ${index + 1} Volume`,
						variableId: `layer_${docIndex + 1}_${index + 1}_volume`,
					})
				}
			})
		})

		this.setVariableDefinitions(variables)
		this.updateStatusVariables()
		this.updateLayerVariables()
	},

	/**
	 * Update the values of static status variables.
	 */
	updateStatusVariables: function (docIndex) {
		let list = {}
		if (docIndex != undefined) {
			//		this.log('debug', `Updating document status: ${docIndex}`)
			list[`doc_${docIndex + 1}_status`] = this.capitalise(this.documents[docIndex].liveState)
			this.setVariableValues(list)
			return
		}

		this.log('debug', 'Updating all documents statuses')
		this.documents.forEach((doc, docIndex) => {
			list[`doc_${docIndex + 1}_status`] = this.capitalise(this.documents[docIndex].liveState)
		})
		this.setVariableValues(list)
	},

	/**
	 * Update the values of dynamic playlist variables.
	 */
	updateLayerVariables: function () {
		let list = {}
		this.log('debug', 'Updating Layer Variables')
		this.documents.forEach((doc, docIndex) => {
			list[`doc_${docIndex + 1}_name`] = doc.label
			//this.debug('-', doc.label)
			doc.layers.forEach((layer, index) => {
				list[`layer_${docIndex + 1}_${index + 1}_name`] = layer.label
				//this.debug('Layer:', layer)
				if (layer.variants.length > 0) {
					//this.debug('Active layer:', layer.variants)
					let activeLayer = layer.variants.find((element) => element.id === layer.activeVariant)
					if (activeLayer) {
						list[`layer_${docIndex + 1}_${index + 1}_activeVariant`] = activeLayer.label
					}
				}
				if (layer.volume != null) {
					list[`layer_${docIndex + 1}_${index + 1}_volume`] = (layer.volume * 100).toFixed()
				}
				//this.debug('- -', layer.label)
			})
		})
		this.setVariableValues(list)
	},

	clearLayerVariables: function (docIndex, layerIndex) {
		let list = {}
		this.log('debug', `Clearing Layer Variables ${docIndex} ${layerIndex}`)
		if (layerIndex) {
			list[`layer_${docIndex + 1}_${layerIndex + 1}_name`] = '-'
			this.serVariableValues(list)
			return
		}

		list[`doc_${docIndex + 1}_name`] = '-'
		this.documents[docIndex].layers.forEach((layer, index) => {
			list[`layer_${docIndex + 1}_${index + 1}_name`] = '-'
		})
		this.setVariableValues(list)
	},

	renderTime: function (seconds) {
		let time = new Date(null)
		time.setSeconds(seconds)
		let timeStr = time.toISOString().substr(11, 8)
		return timeStr.startsWith('00') ? timeStr.substr(3, 5) : timeStr
	},

	capitalise: function (s) {
		if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
	},
}
