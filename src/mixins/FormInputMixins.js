export default {
	data() {
		return {
			inputType: ['number', 'text', 'password'],
		}
	},
	methods: {
		formInputType(type) {
			if (this.inputType.includes(type)) {
				return 'input'
			} else {
				return type
			}
		},
	},
}
