<template>
	<div class="add-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="$router.push({ name: 'ListAlatLaboratorium' })"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!formFilled"
				@click="sendAddAlat"
			>
				Simpan
			</button>
		</div>
		<!-- END: BUTTON GROUP -->

		<!-- FORM GROUP -->
		<section class="section-form-group">
			<div class="smil-row">
				<div
					class="form-group col-lg-6 col-12"
					v-for="(form, idxInput) in formGroupList"
					:key="`form-input-${idxInput}`"
				>
					<label class="form-label" :for="`input-${idxInput + 1}`">
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
						@change="changeValue"
					/>
					<!-- END: INPUT TAG -->

					<!-- START: SELECT TAG -->
					<select
						v-model="form.model"
						class="custom-select"
						v-if="form.type === 'select'"
						@change="changeValue"
					>
						<option value="" disabled> Pilih {{ form.label }} </option>
						<option
							:value="ops.id"
							v-for="(ops, idxOps) in form.options"
							:key="`options-${idxOps}`"
						>
							{{ ops.text }}
						</option>
					</select>

					<!-- END: SELECT TAG -->
				</div>
			</div>
			<!-- START: SPESIFIKASI SECTION -->
			<div class="spesifikasi-section">
				<h5 class="label">Spesifikasi Alat</h5>
				<div class="smil-row">
					<template v-if="Object.keys(spesifikasi).length > 0">
						<div
							class="form-group col-lg-6 col-12"
							v-for="(spec, idxSpek) in Object.keys(spesifikasi)"
							:key="`spesifikasi-${idxSpek}`"
						>
							<label class="form-label" :for="`input-${idxSpek + 1}`">
								{{ spesifikasi[spec].label }}
							</label>
							<input
								type="text"
								class="form-control"
								@change="changeSpec($event, spec)"
								:placeholder="spesifikasi[spec].label"
							/>
						</div>
					</template>
					<template v-else>
						<div class="form-group col-12">
							<h5 class="empty-desc">
								Jenis Alat belum ditentukan
							</h5>
						</div>
					</template>
				</div>
			</div>
			<!-- END: SPESIFIKASI SECTION -->
		</section>
		<!-- FORM GROUP -->

		<!-- START: POPUP -->
		<b-modal
			ref="modal-popup"
			id="modal-popup"
			centered
			hide-footer
			hide-header
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
		name: 'add-alat-lab',
		components: { BaseModalAlert },
		mixins: [FormInputMixins, ModalMixins],
		data() {
			return {
				formInput: {
					nama: '',
					asal: '',
					tahun: '',
					supplier: '',
					jumlahAlat: 0,
					jenisAlat: '',
					spesifikasi: {},
				},
				formGroupList: [
					{
						label: 'Nama Alat',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nama Alat Baru',
						isRequired: true,
					},
					{
						label: 'Asal Pengadaan Alat',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Pilih Asal Pengadaan Alat',
						isRequired: true,
						options: [],
					},
					{
						label: 'Tahun Pengadaan Alat',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Tahun Pengadaan Alat',
						isRequired: true,
					},
					{
						label: 'Supplier Alat',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Pilih Supplier Alat',
						isRequired: false,
						options: [],
					},
					{
						label: 'Jumlah Alat',
						type: 'number',
						model: '',
						description: '',
						placeholder: 'Jumlah Alat Baru',
						isRequired: true,
					},
					{
						label: 'Jenis Alat',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Pilih Jenis Alat',
						isRequired: true,
						options: [],
					},
					{
						label: 'Lokasi Penyimpanan',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Pilih Lokasi Penyimpanan',
						isRequired: true,
						options: [],
					},
				],
				spesifikasi: {},
			}
		},
		mounted() {
			this.getJenisAlat()
			this.supplierList()
			this.getAsalAlat()
		},
		watch: {
			spesifikasi: {
				immediate: true,
				deep: true,
				handler: function() {},
			},
		},
		computed: {
			formFilled() {
				return (
					this.submitRequest.alat_name !== '' &&
					this.submitRequest.asal_pengadaan_id !== '' &&
					this.submitRequest.alat_year !== '' &&
					this.submitRequest.alat_total !== '' &&
					this.submitRequest.jenis_alat_id !== '' &&
					this.submitRequest.lokasi_id !== ''
				)
			},
			submitRequest() {
				let form = this.formGroupList

				return {
					alat_name: form[0].model,
					asal_pengadaan_id: form[1].model,
					alat_year: form[2].model,
					supplier_id: form[3].model,
					alat_total: form[4].model,
					jenis_alat_id: form[5].model,
					lokasi_id: form[6].model,
					alat_specs: null,
				}
			},
		},
		methods: {
			// Call API
			supplierList() {
				// Akan memanggil API Supplier
				let listSupplier = [
					{
						id: 1,
						text: 'PT Anugerah Sejahtera',
						disabled: false,
					},
				]

				this.formGroupList[3].options = listSupplier
			},
			getJenisAlat() {
				// Akan memanggil API Jenis Alat
				let listJenis = [
					{
						id: 1,
						text: 'Laptop',
						attr_spek: ['Processor', 'Ukuran Layar', 'RAM', 'VGA'],
						disabled: false,
					},
					{
						id: 2,
						text: 'Smartphone',
						attr_spek: [
							'Processor',
							'Resolusi Kamera',
							'RAM',
							'Android Version',
						],
						disabled: false,
					},
				]

				this.formGroupList[5].options = listJenis
			},
			getAsalAlat() {
				// Memanggil API Asal Alat
				let listAsal = [
					{
						id: 1,
						text: 'Barang Habis Pakai',
						disabled: false,
					},
					{
						id: 2,
						text: 'Hibah Tugas Akhir',
						disabled: false,
					},
					{
						id: 3,
						text: 'Supplier',
						disabled: false,
					},
					{
						id: 4,
						text: 'PNJ',
						disabled: false,
					},
					{
						id: 5,
						text: 'Hibah Pemerintah',
						disabled: false,
					},
				]

				this.formGroupList[1].options = listAsal
			},
			getLokasiAlat() {
				// Panggil API Lokasi Alat
				let listLokasi = [
					{
						id: 1,
						text: 'Lemari A',
						disabled: false,
					},
					{
						id: 2,
						text: 'Lemari A Test',
						disabled: false,
					},
				]
				this.formGroupList[6].options = listLokasi
			},
			sendAddAlat() {
				this.submitRequest.alat_specs = JSON.stringify(this.spesifikasi)
				alert(this.submitRequest.alat_specs)
			},
			// Form Interaction
			changeValue() {
				let form = this.formGroupList
				let payload = this.submitRequest
				// Ketika Jenis Alat Disi
				if (payload.jenis_alat_id !== '' && payload.jenis_alat_id !== null) {
					this.spesifikasi = {}
					let getJenisAlat = form[5].options.find(
						(jal) => jal.id === payload.jenis_alat_id
					)

					getJenisAlat.attr_spek.forEach((spek) => {
						let key = spek.replace(/\s/, '_').toLowerCase() //Mengubah spek yg terdapat spasi dengan _
						this.spesifikasi[key] = {
							label: spek,
							value: '',
						}
					})
				}

				// Total Alat
				if (payload.alat_total !== '' && payload.alat_total !== null) {
					this.getLokasiAlat()
				} else {
					this.formGroupList[6].options = []
				}
			},
			changeSpec(event, key) {
				if (Object.keys(this.spesifikasi).length > 0) {
					this.spesifikasi[key]['value'] = event.target.value
				}
			},
		},
		beforeRouteLeave(to, from, next) {
			let confirmCancel = confirm(
				'Apakah anda yakin ingin membatalkan tambah data?'
			)
			if (confirmCancel) {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.add-alat-lab {
		.section-form-group {
			margin-top: 30px;
		}
		.spesifikasi-section {
			.label {
				font-size: 14px;
				font-weight: 700;
				padding-left: 15px;
				margin-top: 35px;
				margin-bottom: 20px;
			}
			.empty-desc {
				font-size: 14px;
				color: #696969;
			}
		}
	}
</style>

<style lang="scss">
	.add-alat-lab {
		@import '@/assets/css/global.scss';
	}
</style>
