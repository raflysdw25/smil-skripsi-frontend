<template>
	<div class="add-staff-laboratorium">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="backToList('ListStaffLaboratorium')"
			>
				Batal
			</button>
			<button class="smil-btn smil-bg-primary" :disabled="!formFilled">
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
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'add-staff-laboratorium',
		mixins: [FormInputMixins],
		computed: {
			formFilled() {
				return (
					this.addStaffRequest.nip !== '' &&
					this.addStaffRequest.jabatan_id !== '' &&
					this.addStaffRequest.tgl_mulai !== '' &&
					this.addStaffRequest.tgl_akhir !== ''
				)
			},
			addStaffRequest() {
				let form = this.formGroupList
				return {
					nip: form[0].model.split(' - ')[0],
					jabatan_id: form[2].model.split(' - ')[0],
					tgl_mulai: form[3].model,
					tgl_akhir: form[4].model,
				}
			},
		},
		data() {
			return {
				formGroupList: [
					{
						id: 1,
						label: 'Nomor Induk Pegawai',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Nomor Induk Pegawai',
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
		},
		watch: {},
		methods: {
			backToList(routeTo) {
				let confirmCancel = confirm(
					'Apakah anda yakin ingin membatalkan tambah staff laboratorium?'
				)
				if (confirmCancel) {
					this.$router.push({ name: routeTo })
				}
			},
			async getListStaffJurusan() {
				let list = [
					{
						nip: '3271032506990001',
						text: '3271032506990001 - Muhammad Rafly Sadewa',
						value: '3271032506990001 - Muhammad Rafly Sadewa',
					},
					{
						nip: '3271022109970901',
						text: '3271022109970901 - Bima Anggara Pratama',
						value: '3271022109970901 - Bima Anggara Pratama',
					},
				]
				this.formGroupList[0].options = list
			},
			async getListJabatanAdmin() {
				let list = [
					{
						id: 1,
						text: `${1} - Kepala Laboratorium`,
						value: `${1} - Kepala Laboratorium`,
					},
					{
						id: 2,
						text: `${2} - Pranata Laboratorium Pendidikan`,
						value: `${2} - Pranata Laboratorium Pendidikan`,
					},
				]
				// let list = ['TMD', 'TMJ', 'TI', 'TKJ']
				this.formGroupList[2].options = list
			},
			// Form Interactions
			setNullString(form) {
				form.model = ''
			},
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

			height: 40px;
		}
	}
</style>
