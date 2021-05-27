<template>
	<div class="add-staff-jurusan">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="$router.push({ name: 'ListCivitasJurusan' })"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!formFilled"
				@click="sendAddStaffJurusan"
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
					:key="`form-input-${indexInput}`"
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
		name: 'add-staff-jurusan',
		mixins: [FormInputMixins, ModalMixins],
		components: { BaseModalAlert },
		computed: {
			formFilled() {
				let submit = this.submitAddRequest
				return (
					submit.nip !== '' &&
					submit.staff_fullname !== '' &&
					submit.email !== '' &&
					submit.phone_number !== ''
				)
			},
			submitAddRequest() {
				let form = this.formGroupList
				let prodi = this.formGroupList[3].options.find(
					(ops) => ops.text === this.formGroupList[3].model
				)
				return {
					nip: form[0].model,
					staff_fullname: form[1].model,
					email: form[2].model,
					phone_number: form[4].model,
					address: form[5].model,
					prodi_id: prodi ? prodi.prodi_id : null,
				}
			},
		},
		data() {
			return {
				formGroupList: [
					{
						label: 'Nomor Induk Pegawai',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nomor Induk Pegawai',
						isRequired: true,
						disabled: false,
					},
					{
						label: 'Nama Pegawai',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nama Pegawai',
						isRequired: true,
						disabled: false,
					},
					{
						label: 'Email',
						type: 'email',
						model: '',
						description: '',
						placeholder: 'Email',
						isRequired: true,
						disabled: false,
					},
					{
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
						label: 'Nomor Telepon',
						type: 'tel',
						model: '',
						description: '',
						placeholder: 'Nomor Telepon',
						isRequired: true,
						disabled: false,
					},
					{
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
			this.getListProdi()
		},
		watch: {},
		methods: {
			// Call API
			async getListProdi() {
				let list = [
					{
						prodi_id: 1,
						text: 'Teknik Multimedia dan Digital',
					},
					{
						prodi_id: 2,
						text: 'Teknik Multimedia Jaringan',
					},
					{
						prodi_id: 3,
						text: 'Teknik Informatika',
					},
					{
						prodi_id: 4,
						text: 'Teknik Jaringan dan Komputer',
					},
				]
				// let list = ['TMD', 'TMJ', 'TI', 'TKJ']
				this.formGroupList[3].options = list
			},
			sendAddStaffJurusan() {
				alert(
					`${this.submitAddRequest.staff_fullname} - ${this.submitAddRequest.prodi_id}`
				)
			},
		},
		beforeRouteLeave(to, from, next) {
			let confirmCancel = confirm(
				'Apakah anda yakin ingin membatalkan tambah staff jurusan?'
			)
			if (confirmCancel) {
				next()
			}
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
