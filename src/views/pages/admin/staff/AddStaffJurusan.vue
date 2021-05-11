<template>
	<div class="add-staff-jurusan">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="backToList('ListStaffJurusan')"
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
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'add-staff-jurusan',
		mixins: [FormInputMixins],
		computed: {
			formFilled() {
				return (
					this.addStaffRequest.nip !== '' &&
					this.addStaffRequest.email !== '' &&
					this.addStaffRequest.telepon !== ''
				)
			},
			addStaffRequest() {
				let form = this.formGroupList
				return {
					nip: form[0].model.split(' - ')[0],
					email: form[1].model,
					telepon: form[3].model,
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
						disabled: false,
					},
					{
						id: 3,
						label: 'Program Studi',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Program Studi',
						isRequired: false,
						disabled: false,
						options: [],
					},
					{
						id: 4,
						label: 'Nomor Telepon',
						type: 'tel',
						model: '',
						description: '',
						placeholder: 'Nomor Telepon',
						isRequired: true,
						disabled: false,
					},
					{
						id: 5,
						label: 'Alamat',
						type: 'text-area',
						model: '',
						description: '',
						placeholder: 'Alamat Staff',
						isRequired: false,
						disabled: false,
					},
				],
			}
		},
		async mounted() {
			await this.getListStaffJurusan()
			await this.getListProdi()
		},
		watch: {},
		methods: {
			backToList(routeTo) {
				let confirmCancel = confirm(
					'Apakah anda yakin ingin membatalkan tambah staff jurusan?'
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
			async getListProdi() {
				let list = [
					{
						id: 1,
						text: 'Teknik Multimedia dan Digital',
						value: 1,
					},
					{
						id: 2,
						text: 'Teknik Multimedia Jaringan',
						value: 2,
					},
					{
						id: 3,
						text: 'Teknik Informatika',
						value: 3,
					},
					{
						id: 4,
						text: 'Teknik Jaringan dan Komputer',
						value: 4,
					},
				]
				// let list = ['TMD', 'TMJ', 'TI', 'TKJ']
				this.formGroupList[3].options = list
			},
		},
	}
</script>

<style lang="scss" scoped>
	// .add-staff-jurusan {
	// }
</style>
<style lang="scss">
	.add-staff-jurusan {
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
