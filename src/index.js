const instance_skel = require('../../../instance_skel')
const { initAPI, sendGetRequest } = require('./api')
const actions = require('./actions')
//const presets = require('./presets')
const {
	updateVariableDefinitions,
	updateStatusVariables,
	updateLayerVariables,
	clearLayerVariables,
} = require('./variables')
const { initFeedbacks, executeFeedback } = require('./feedbacks')
const { getDocument, getLayer, getLayerSet, getOutput } = require('./utils')

let debug
let log

/**
 * Companion instance class for Boinx Software mimoLive
 */
class instance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
		})

		this.sendGetRequest = sendGetRequest
		this.updateVariableDefinitions = updateVariableDefinitions
		this.updateStatusVariables = updateStatusVariables
		this.updateLayerVariables = updateLayerVariables
		this.clearLayerVariables = clearLayerVariables
		this.getDocument = getDocument
		this.getLayer = getLayer
		this.getLayerSet = getLayerSet
		this.getOutput = getOutput

		this.port = 8989 // Fixed port
		this.apiSlug = '/api/v1/' // Needed for all api calls

		this.documents = []

		this.CHOICES_DOCUMENTACTIONS = [
			{ id: 'setLive', label: 'Set Live' },
			{ id: 'setOff', label: 'Set Off' },
			{ id: 'toggleLive', label: 'Toggle Live' },
		]
		this.CHOICES_LAYERACTIONS = [
			{ id: 'setLive', label: 'Set Live' },
			{ id: 'setOff', label: 'Set Off' },
			{ id: 'toggleLive', label: 'Toggle Live' },
			{ id: 'cycleThroughVariants', label: 'Cycle Through Variants' },
		]
		this.CHOICES_OUTPUTACTIONS = [
			{ id: 'setLive', label: 'Set Live' },
			{ id: 'setOff', label: 'Set Off' },
			{ id: 'toggleLive', label: 'Toggle Live' },
		]

		this.REGEX_DOCUMENT = '(^[0-9]+$)|(/api/v1/documents/([0-9]+))'
		this.REGEX_LAYER = '^([0-9]+,[0-9]+)|(/api/v1/documents/([0-9]+)/layers/([0-9-A-Z]+))$'
		this.REGEX_OUTPUT = '^/api/v1/documents/([0-9]+)/output-destinations/([0-9-A-Z]+)$'
		this.REGEX_LAYERSET = '^/api/v1/documents/([0-9]+)/layer-sets/([0-9-A-Z]+)$'
	}

	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This will establish a TCP connection to the device',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP,
			},
		]
	}

	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.debug('destroy', this.id)
	}

	init() {
		debug = this.debug
		log = this.log

		this.status(this.STATUS_WARNING, 'Connecting')

		initAPI.bind(this)()

		this.initVariables()
		this.initFeedbacks()
		this.actions()
	}

	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initVariables() {
		this.updateVariableDefinitions()
	}

	/**
	 * Set available feedback choices
	 */
	initFeedbacks() {
		const feedbacks = initFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	/**
	 * Set all the actions
	 * @param  {} system
	 */
	actions(system) {
		this.setActions(this.getActions())
	}

	sendCommand(cmd) {
		if (cmd !== undefined && cmd != '') {
			if (this.socket !== undefined && this.socket.connected) {
				this.socket.send(cmd)
			}
		}
	}

	updateConfig(config) {
		let resetConnection = false

		if (this.config.host != config.host) {
			resetConnection = true
		}

		this.config = config

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		}
	}
}

exports = module.exports = instance
