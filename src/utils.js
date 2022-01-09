function getDocument(reference) {
	//	this.debug("Getting document:", reference)
	if (this.documents[reference - 1] != undefined) {
		return this.documents[reference - 1]
	}

	let doc = RegExp(/documents\/(\d+)/).exec(reference)
	//	this.debug('doc:', doc)
	if (doc) {
		return this.documents.find((d) => d.id === doc[1])
	}

	return false
}

function getLayer(ref) {
	//	this.debug('Getting layer:', ref)
	let layer = RegExp(/^(\d+),(\d+)$/).exec(ref)
	//	this.debug('Layer is:', layer)
	if (layer) {
		const doc = getDocument.bind(this)(layer[1])
		if (doc) {
			return doc.layers[layer[2] - 1]
		}
	}

	layer = RegExp(/\/documents\/([0-9]+)\/layers\/([0-9-A-Z]+)$/).exec(ref)
	//	this.debug('Layer is:', layer)
	if (layer) {
		const doc = getDocument.bind(this)('documents/' + layer[1])
		if (doc) {
			return doc.layers.find((l) => l.id === layer[2])
		}
	}

	return false
}

function getVariant(ref) {
	// this.debug('Getting variant:', ref)
	let variant = RegExp(this.REGEX_VARIANT).exec(ref)
	// this.debug('Variant is:', variant)
	if (variant) {
		const layer = this.getLayer(`/documents/${variant[1]}/layers/${variant[2]}`)
		if (layer) {
			// this.debug('Layer is:', layer)
			return layer.variants.find((v) => v.id === variant[3])
		}
	}
}

function getLayerSet(ref) {
	let layerSet = RegExp(this.REGEX_LAYERSET).exec(ref)
	if (layerSet) {
		const doc = this.getDocument(ref)
		if (doc) {
			return doc.layerSets.find((o) => o.id === layerSet[2])
		}
	}

	return false
}

function getOutput(ref) {
	//	this.debug('Ref:', ref)
	let output = RegExp(this.REGEX_OUTPUT).exec(ref)
	//	this.debug('Output is:', output)
	if (output) {
		const doc = this.getDocument(ref)
		if (doc) {
			return doc.outputs.find((o) => o.id === output[2])
		}
	}

	return false
}

module.exports = {
	getDocument,
	getLayer,
	getVariant,
	getLayerSet,
	getOutput,
}
