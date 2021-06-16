export default {
	data() {
		return {}
	},
	methods: {
		getErrorMessage(e, typeDisplayError = 'modal') {
			// typeDisplayError : alert() -> alert, showAlert() -> modal
			if (e.response) {
				let err = e.response.data
				if (err.response.code === 400) {
					let mKey = Object.keys(err.response.message)
					let message = err.response.message
					if (typeDisplayError == 'alert') {
						let output = ''
						mKey.forEach((key, idxKey) => {
							if (idxKey !== mKey.length - 1) {
								output += `${message[key]}, `
							} else {
								output += `${message[key]}`
							}
						})
						return output
					} else if (typeDisplayError == 'modal') {
						let output = []
						mKey.forEach((key, idxKey) => {
							let modalNotes = {
								title: key,
								message: message[key],
							}
							output.push(modalNotes)
						})
						return output
					}
				} else {
					return err.response.message
				}
			} else {
				return e
			}
		},
	},
	computed: {
		environment() {
			return process.env.NODE_ENV
		},
		adminData() {
			return this.$store.state.admin ? this.$store.state.admin : null
		},
		isKaLab() {
			return this.adminData.jabatan_id == 2
		},
		isSuperAdmin() {
			return this.adminData.jabatan_id == 1
		},
		isMobile() {
			const toMatch = [
				/Android/i,
				/webOS/i,
				/iPhone/i,
				/iPad/i,
				/iPod/i,
				/BlackBerry/i,
				/Windows Phone/i,
			]

			return toMatch.some((toMatchItem) => {
				return navigator.userAgent.match(toMatchItem)
			})
		},
	},
}
