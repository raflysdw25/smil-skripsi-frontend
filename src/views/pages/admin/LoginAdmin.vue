<template>
	<div class="login-admin">
		<section class="login-form-section">
			<div class="banner-jurusan">
				<img src="@/assets/images/Logo_PNJ.png" alt="" srcset="" />
				<p class="banner-title">
					Laboratorium Jurusan Teknik Informatika dan Komputer
				</p>
			</div>
			<h4>Silahkan Login untuk Memulai Sesi Anda</h4>
			<div class="form-section">
				<div
					class="form-group"
					v-for="(form, indexInput) in formGroupList"
					:key="`form-input-${indexInput}-${form.id}`"
				>
					<label :for="`input-${indexInput + 1}`">
						{{ form.label }}
						<span
							v-if="form.isRequired"
							style="color: #dc3545; font-size: 14px"
						>
							*
						</span>
					</label>
					<!-- START: INPUT TAG -->
					<input
						:type="form.type"
						class="form-control"
						v-model="formInput[form.model]"
						:placeholder="form.placeholder"
						:required="form.isRequired"
					/>
					<!-- END: INPUT TAG -->
				</div>
				<div class="button-group" v-if="btnGroup">
					<button
						class="smil-btn smil-bg-primary"
						:disabled="!formFilled"
						@click="loginAdmin"
					>
						Masuk
					</button>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	// Componenets

	// Vuex
	import * as types from '@/store/types'
	export default {
		name: 'login-admin',
		components: {},
		data() {
			return {
				formGroupList: [
					{
						id: 1,
						label: 'Nomor Induk Pegawai',
						type: 'text',
						model: 'nip',
						description: '',
						placeholder: 'Nomor Induk Pegawai',
						isRequired: true,
					},
					{
						id: 2,
						label: 'Password',
						type: 'password',
						model: 'password',
						description: '',
						placeholder: 'Password',
						isRequired: true,
					},
				],
				btnGroup: [
					{
						id: 1,
						text: 'Submit',
						type: 'submit',
						class: 'smil-bg-primary',
						size: '',
					},
				],
				formInput: {
					nip: '',
					password: '',
				},
				buttonActive: false,
			}
		},
		watch: {},
		computed: {
			formFilled() {
				return this.formInput.nip !== '' && this.formInput.password !== ''
			},
		},
		methods: {
			loginAdmin() {
				// Untuk slicing Design
				let adminData = {
					nip: '3271032506990001',
					nama: 'Muhammad Rafly Sadewa',
					jabatan: 1, //PLP, STAFF, ADMIN TI
				}

				// Get Data Admin via API

				// Save Token into Local Storage or Cookies

				// Save data admin into Vuex
				this.$store.dispatch(types.UPDATE_ADMIN, adminData)
				this.$router.push({ name: 'DashboardAdmin' })
			},
			resetLoginAdmin(form) {
				Object.keys(form).forEach((key) => {
					this.formInput[key] = ''
				})
			},
			saveDataAdmin(form) {
				Object.keys(form).forEach((key) => {
					this.formInput[key] = form[key]
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.login-admin {
		display: flex;
		height: 100vh;
		// background-color: #c5c5c5;
		font-family: Arial, Helvetica, sans-serif;
		.login-form-section {
			width: 550px;
			margin: auto;
			display: flex;
			align-items: center;
			flex-flow: column;
			.banner-jurusan {
				width: 450px;
				display: flex;
				align-items: center;
				margin-bottom: 28px;
				img {
					width: 110px;
					height: 110px;
				}
				.banner-title {
					font-size: 18px;
					font-weight: bolder;
					text-transform: uppercase;
					font-style: italic;
					margin-bottom: 0;
					margin-left: 10px;
				}
			}

			.form-section {
				margin-top: 30px;
				width: 360px;
				.button-group {
					display: flex;
					button {
						width: 100%;
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	.login-admin {
		// .form-control {
		// 	color: #000;
		// 	background-color: #fff;
		// 	border-color: #c5c5c5;
		// 	border-radius: 5px;
		// 	&:focus {
		// 		box-shadow: 0 0 0 5px #c5c5c5;
		// 	}
		// 	&:disabled {
		// 		background-color: #c5c5c5;
		// 		border-color: #696969;
		// 	}

		// 	height: 40px;
		// }
		@import '@/assets/css/global.scss';
	}
</style>
