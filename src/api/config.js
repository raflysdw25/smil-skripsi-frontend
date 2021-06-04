import axios from 'axios'

const domain_api = process.env.VUE_APP_BASE_API_ADMIN_SMIL

let token = localStorage.getItem('access_token')

export const admin_api = axios.create({
	baseURL: domain_api,
	headers: {
		'Content-type': 'application/json',
		Authorization: `Bearer ${token}`,
	},
})

export const auth_admin = axios.create({
	baseURL: domain_api,
	headers: {
		'Content-type': 'application/json',
	},
})
