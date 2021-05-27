<template>
	<div class="add-staff-laboratorium">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="$router.push({ name: 'ListStaffLaboratorium' })"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!formFilled"
				@click="sendAddRequest"
			>
				Simpan
			</button>
		</div>
		<!-- END: BUTTON GROUP -->
		<section class="section-form-group">
			<div class="smil-row">
				<div
					class="form-group col-lg-6 col-12"
					v-for="(form, indexInput) in formGroupList"
					:key="`form-input-${indexInput}-${form.id}`"
				>
					<label class="form-label" :for="`input-${indexInput + 1}`">
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
						v-if="formInputType(form.type) === 'input'"
						class="form-control"
						v-model="form.model"
						:placeholder="form.placeholder"
						:required="form.isRequired"
						:disabled="form.disabled"
						@keypress="formConstraint($event, form.type)"
						@change="changeValue"
					/>
					<!-- END: INPUT TAG -->

					<!-- START: Text Area -->
					<textarea
						class="form-control"
						v-if="form.type === 'text-area'"
						v-model="form.model"
						cols="30"
						rows="10"
						:placeholder="form.placeholder"
					></textarea>
					<!-- END: Text Area -->

					<!-- START: SELECT TAG -->
					<b-form-input
						v-if="form.type === 'select'"
						:list="`input-list-${indexInput}`"
						id="input-with-list"
						v-model="form.model"
						:placeholder="form.placeholder"
						@change="changeValue"
					></b-form-input>
					<b-form-datalist
						:id="`input-list-${indexInput}`"
						:options="form.options"
					></b-form-datalist>
					<!-- END: SELECT TAG -->

					<!-- Datepicker -->
					<date-picker
						v-if="form.type === 'date'"
						format="DD-MM-YYYY"
						value-type="format"
						v-model="form.model"
						:disabled="form.disabled"
						@closed="setNullString(form.model)"
						:placeholder="form.placeholder"
						@change="changeValue"
					>
						<template slot="icon-clear">
							<b-icon-x-circle-fill></b-icon-x-circle-fill>
						</template>
						<template slot="icon-calendar">
							<b-icon icon="calendar-month-fill"></b-icon>
						</template>
					</date-picker>
					<!-- Datepicker -->
				</div>
			</div>
		</section>

		<!-- START: POPUP -->
		<b-modal
			ref="modal-popup"
			hide-footer
			hide-header
			centered
			no-close-on-backdrop
			no-close-on-esc
		>
			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>
		</b-modal>
		<!-- END: POPUP -->
	</div>
</template>

<script>
	// Components
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'
	export default {
		name: 'add-staff-laboratorium',
		mixins: [FormInputMixins, ModalMixins],
		components: { BaseModalAlert },
		computed: {
			formFilled() {
				let form = this.submitAddRequest

				return (
					form.nip !== '' &&
					form.jabatan_id !== null &&
					(form.active_period !== null || form.active_period !== '')
				)
			},
			submitAddRequest() {
				let form = this.formGroupList

				let staff = form[0].options.find((ops) => ops.text === form[0].model)
				let jabatan = form[2].options.find((ops) => ops.text === form[2].model)
				return {
					nip: staff ? staff.nip : null,
					email: form[1].model,
					jabatan_id: jabatan ? jabatan.id : null,
					active_period: form[4].model,
				}
			},
		},
		data() {
			return {
				formGroupList: [
					{
						id: 1,
						label: 'Nama Pegawai',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Nama Pegawai',
						isRequired: true,
						disabled: false,
						options: [],
					},

					{
						id: 2,
						label: 'Email',
						type: 'email',
						model: '',
						description: '',
						placeholder: 'Email',
						isRequired: true,
						disabled: true,
					},
					{
						id: 3,
						label: 'Jabatan',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Jabatan',
						isRequired: false,
						disabled: false,
						options: [],
					},
					{
						id: 4,
						label: 'Waktu Mulai Jabatan',
						type: 'date',
						model: this.formatDate(new Date()),
						description: '',
						placeholder: 'Waktu Mulai Jabatan',
						isRequired: true,
						disabled: false,
					},
					{
						id: 5,
						label: 'Waktu Selesai Jabatan',
						type: 'date',
						model: '',
						description: '',
						placeholder: 'Waktu Selesai Jabatan',
						isRequired: false,
						disabled: false,
					},
				],
			}
		},
		async mounted() {
			await this.getListStaffJurusan()
			await this.getListJabatanAdmin()
			// this.showAlert(false, false, 'Alert Berhasil')
		},
		watch: {},
		methods: {
			async getListStaffJurusan() {
				let list = [
					{
						nip: '3271032506990001',
						email: 'raflysdw25@gmail.com',
						text: 'Muhammad Rafly Sadewa',
					},
					{
						nip: '3271022109970901',
						email: 'prtmanggara@gmail.com',
						text: 'Bima Anggara Pratama',
					},
				]
				this.formGroupList[0].options = list
			},
			async getListJabatanAdmin() {
				let list = [
					{
						id: 1,
						text: `Kepala Laboratorium`,
						// value: `Kepala Laboratorium`,
					},
					{
						id: 2,
						text: `Pranata Laboratorium Pendidikan`,
						// value: `Pranata Laboratorium Pendidikan`,
					},
				]
				// let list = ['TMD', 'TMJ', 'TI', 'TKJ']
				this.formGroupList[2].options = list
			},
			sendAddRequest() {},
			// Form Interactions
			changeValue() {
				let form = this.formGroupList
				if (form[0].model !== '') {
					let staff = form[0].options.find((ops) => ops.text === form[0].model)
					form[1].model = staff.email
				}
			},
			setNullString(form) {
				form.model = ''
			},
		},
		beforeRouteLeave(to, from, next) {
			let confirmCancel = confirm(
				'Apakah anda yakin ingin membatalkan tambah staff laboratorium?'
			)
			if (confirmCancel) {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.add-staff-laboratorium {
		.mx-datepicker {
			width: 100%;
		}
	}
</style>
<style lang="scss">
	.add-staff-laboratorium {
		input.form-control,
		.custom-select {
			color: #000;
			background-color: #fff;
			border-color: #c5c5c5;
			border-radius: 5px;
			font-size: 12px;
			&:focus {
				box-shadow: 0 0 0 5px #c5c5c5;
			}
			&:disabled {
				background-color: #c5c5c5;
				border-color: #696969;
			}

			height: 50px;
		}
		.mx-input {
			height: 50px;
		}
	}
</style>
