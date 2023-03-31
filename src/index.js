const { runEntrypoint, InstanceBase, InstanceStatus, Regex } = require('@companion-module/base')
const api = require('./api')
const actions = require('./actions')
const variables = require('./variables')
const feedbacks = require('./feedbacks')
const presets = require('./presets')
const utils = require('./utils')

let debug
let log

/**
 * Companion instance class for Boinx Software mimoLive
 */
class MimoLiveInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		Object.assign(this, {
			...api,
			...actions,
			...variables,
			...feedbacks,
			...presets,
			...utils,
		})

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
		this.CHOICES_VARIANTACTIONS = [
			{ id: 'setLive', label: 'Set Live' },
			{ id: 'setOff', label: 'Set Off' },
			{ id: 'toggleLive', label: 'Toggle Live' },
		]
		this.CHOICES_OUTPUTACTIONS = [
			{ id: 'setLive', label: 'Set Live' },
			{ id: 'setOff', label: 'Set Off' },
			{ id: 'toggleLive', label: 'Toggle Live' },
		]

		this.REGEX_DOCUMENT = '(^[0-9]+$)|(/api/v1/documents/([0-9]+))'
		this.REGEX_LAYER = '^([0-9]+,[0-9]+)|(/api/v1/documents/([0-9]+)/layers/([0-9-A-Z]+))$'
		this.REGEX_VARIANT = '^/api/v1/documents/([0-9]+)/layers/([0-9-A-Z]+)/variants/([0-9-A-Z]+)$'
		this.REGEX_OUTPUT = '^/api/v1/documents/([0-9]+)/output-destinations/([0-9-A-Z]+)$'
		this.REGEX_LAYERSET = '^/api/v1/documents/([0-9]+)/layer-sets/([0-9-A-Z]+)$'
	}

	getConfigFields() {
		return [
			{
				type: 'static-text',
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
				regex: Regex.IP,
			},
		]
	}

	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.log('debug', `destroy ${this.id}`)
	}

	async init(config) {
		this.config = config
		debug = this.debug
		log = this.log

		this.updateStatus(InstanceStatus.Connecting)

		this.initAPI()

		this.initVariables()
		this.initFeedbacks()
		this.initActions()
		this.initPresets()
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
		const feedbacks = this.defineFeedbacks()
		this.setFeedbackDefinitions(feedbacks)
	}

	/**
	 * Initialize presets
	 * @param  {} updates
	 */
	initPresets(updates) {
		this.setPresetDefinitions(this.getPresets())
	}

	/**
	 * Set all the actions
	 * @param  {} system
	 */
	initActions(system) {
		this.setActionDefinitions(this.getActions())
	}

	sendCommand(cmd) {
		if (cmd !== undefined && cmd != '') {
			if (this.socket !== undefined && this.socket.connected) {
				this.socket.send(cmd)
			}
		}
	}

	async configUpdated(config) {
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

runEntrypoint(MimoLiveInstance, [])