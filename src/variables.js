/**
 * Update the available static and dynamic variable definitions.
 */
exports.updateVariableDefinitions = function () {
	const variables = []

	this.debug('Build document variables.')
	// document variables:
	this.documents.forEach((doc, docIndex) => {
		variables.push({
			label: `Document ${docIndex + 1} Name`,
			name: `doc_${docIndex + 1}_name`,
		})

		variables.push({
			label: `Document ${docIndex + 1} Status`,
			name: `doc_${docIndex + 1}_status`,
		})

		doc.layers.forEach((layer, index) => {
			variables.push({
				label: `Doc ${docIndex + 1} Layer ${index + 1} Name`,
				name: `layer_${docIndex + 1}_${index + 1}_name`,
			})
			variables.push({
				label: `Doc ${docIndex + 1} Layer ${index + 1} Active Variant`,
				name: `layer_${docIndex + 1}_${index + 1}_activeVariant`,
			})
		})
	})

	this.setVariableDefinitions(variables)
	this.updateStatusVariables()
	this.updateLayerVariables()
}

/**
 * Update the values of static status variables.
 */
exports.updateStatusVariables = function (docIndex) {
	if (docIndex != undefined) {
		this.debug('Updating document status:', docIndex)
		this.setVariable(`doc_${docIndex + 1}_status`, capitalise(this.documents[docIndex].liveState))
		return
	}

	this.debug('Updating all documents statuses')
	this.documents.forEach((doc, docIndex) => {
		this.setVariable(`doc_${docIndex + 1}_status`, capitalise(this.documents[docIndex].liveState))
	})
}

/**
 * Update the values of dynamic playlist variables.
 */
exports.updateLayerVariables = function () {
	this.debug('Updating Layer Variables')
	this.documents.forEach((doc, docIndex) => {
		this.setVariable(`doc_${docIndex + 1}_name`, doc.label)
		//this.debug('-', doc.label)
		doc.layers.forEach((layer, index) => {
			this.setVariable(`layer_${docIndex + 1}_${index + 1}_name`, layer.label)
			//this.debug('Layer:', layer)
			if (layer.variants.length > 0) {
				//this.debug('Active layer:', layer.variants)
				let activeLayer = layer.variants.find((element) => element.id === layer.activeVariant)
				if (activeLayer) {
					this.setVariable(`layer_${docIndex + 1}_${index + 1}_activeVariant`, activeLayer.label)
				}
			}
			//this.debug('- -', layer.label)
		})
	})
}

exports.clearLayerVariables = function (docIndex, layerIndex) {
	this.debug('Clearing Layer Variables', docIndex, layerIndex)
	if (layerIndex) {
		this.setVariable(`layer_${docIndex + 1}_${layerIndex + 1}_name`, '-')
		return
	}

	this.setVariable(`doc_${docIndex + 1}_name`, '-')
	this.documents[docIndex].layers.forEach((layer, index) => {
		this.setVariable(`layer_${docIndex + 1}_${index + 1}_name`, '-')
	})
}

renderTime = function (seconds) {
	let time = new Date(null)
	time.setSeconds(seconds)
	let timeStr = time.toISOString().substr(11, 8)
	return timeStr.startsWith('00') ? timeStr.substr(3, 5) : timeStr
}

capitalise = function (s) {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}
