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
			<button
				class="smil-btn smil-bg-primary"
				@click="confirmNotif"
				:disabled="!formFilled"
			>
				{{ supplierId !== null ? 'Edit' : 'Simpan' }}
			</button>
		</div>
		<!-- END: BUTTON GROUP -->
		<section class="section-form-group">
			<div class="smil-row">
				<div class="icon-class text-center" v-if="loadingForm">
					<b-spinner
						variant="secondary"
						style="width: 140px; height: 140px; margin-bottom: 20px"
					></b-spinner>
					<p class="empty-table-description">
						Sedang Memuat Data...
					</p>
				</div>
				<div
					v-else
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

	// API
	import api from '@/api/admin_api'
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
			supplierId() {
				return this.$route.params.supplier_id
					? parseInt(this.$route.params.supplier_id)
					: null
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
			if (this.supplierId !== null) {
				this.getDetailSupplier()
			}
		},
		methods: {
			// Call API
			async getDetailSupplier() {
				this.loadingForm = true
				try {
					const response = await api.getDetailData('supplier', this.supplierId)
					if (response.data.response.code === 200) {
						let supplier = response.data.data
						let form = this.formGroupList
						form[0].model = supplier.supplier_name
						form[1].model = supplier.supplier_phone
						form[2].model = supplier.person_in_charge
						form[3].model = supplier.supplier_email
						form[4].model = supplier.supplier_address
					} else {
						this.showAlert(false, false, response.data.response.message)
					}
				} catch (e) {
					this.showAlert(false, false, e)
				} finally {
					this.loadingForm = false
				}
			},
			async sendAddSupplier() {
				this.isCreate = true
				this.showAlert(true)
				try {
					const response = await api.createNewData(
						'supplier',
						this.submitRequest
					)
					if (response.data.response.code === 201) {
						setTimeout(() => {
							this.showAlert(false, true, 'Tambah Supplier Berhasil')
							this.$router.push({ name: 'ListSupplier' })
						}, 2000)
					} else {
						this.showAlert(false, false, response.data.response.message)
					}
				} catch (error) {
					this.showAlert(false, false, e)
				}
			},
			async editSupplier() {
				this.isCreate = true
				this.showAlert(true)
				try {
					const response = await api.editData(
						'supplier',
						this.supplierId,
						this.submitRequest
					)
					if (response.data.response.code === 200) {
						setTimeout(() => {
							this.showAlert(false, true, 'Edit Supplier berhasil dilakukan')
							this.$router.push({ name: 'ListSupplier' })
						}, 2000)
					} else {
						this.showAlert(false, false, response.data.response.message)
					}
				} catch (e) {
					this.showAlert(false, false, e)
				} finally {
					this.selectedRowId = null
				}
			},
			// Notif
			confirmNotif() {
				let confirmAction = confirm(
					'Apakah anda yakin ingin menyimpan data supplier?'
				)
				if (confirmAction) {
					if (this.supplierId === null) {
						this.sendAddSupplier()
					} else {
						this.editSupplier()
					}
				}
			},
		},
		beforeRouteLeave(to, from, next) {
			if (!this.isCreate) {
				let confirmCancel = confirm(
					`Apakah anda yakin ingin membatalkan ${
						this.supplierId !== null ? 'edit data' : 'tambah data'
					} supplier? Data yang sudah diinputkan tidak akan disimpan`
				)
				if (confirmCancel) {
					next()
				}
			} else {
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
