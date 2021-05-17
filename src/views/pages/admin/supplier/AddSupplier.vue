<template>
	<div class="add-supplier">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="$router.push({ name: 'ListSupplier' })"
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
					<select
						v-if="form.type === 'select'"
						class="custom-select"
						v-model="form.model"
						:required="form.isRequired"
					>
						<option
							v-for="(ops, indexOps) in form.options"
							:key="`option-${form.model}-${indexOps}-${ops.id}`"
							:disabled="ops.disabled"
							:value="ops.value"
						>
							{{ ops.name }}
						</option>
					</select>
					<!-- END: SELECT TAG -->
				</div>
			</div>
		</section>

		<!-- START: POPUP -->
		<b-modal
			ref="modal-popup"
			no-close-on-backdrop
			no-close-on-esc
			hide-header
			hide-footer
			centered
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
		name: 'add-supplier',
		components: { BaseModalAlert },
		mixins: [FormInputMixins, ModalMixins],
		computed: {
			formFilled() {
				let submit = this.submitRequest
				return (
					submit.supplier_name !== '' &&
					submit.supplier_phone !== '' &&
					submit.person_in_charge !== ''
				)
			},
			submitRequest() {
				let form = this.formGroupList
				return {
					supplier_name: form[0].model,
					supplier_phone: form[1].model,
					person_in_charge: form[2].model,
					supplier_email: form[3].model,
					supplier_address: form[4].model,
				}
			},
		},
		data() {
			return {
				formGroupList: [
					{
						id: 1,
						label: 'Nama Supplier',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nama Supplier',
						isRequired: true,
					},
					{
						id: 2,
						label: 'Nomor Telephone',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nomor Telephone Supplier',
						isRequired: true,
					},
					{
						id: 3,
						label: 'Person In Charge (PIC)',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Person In Charge (PIC)',
						isRequired: true,
					},
					{
						id: 5,
						label: 'Email Supplier',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Email Supplier',
						isRequired: false,
					},
					{
						id: 6,
						label: 'Alamat',
						type: 'text-area',
						model: '',
						description: '',
						placeholder: 'Alamat Supplier',
						isRequired: false,
					},
				],
			}
		},
		mounted() {
			// this.showAlert(false, false, 'Alert Berhasil')
		},
		methods: {},
		beforeRouteLeave(to, from, next) {
			let confirmCancel = confirm(
				'Apakah anda yakin ingin membatalkan tambah supplier? Data yang sudah diinputkan tidak akan disimpan'
			)
			if (confirmCancel) {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	// .add-supplier {
	// }
</style>
<style lang="scss">
	.add-supplier {
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
