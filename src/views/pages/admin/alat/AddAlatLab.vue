<template>
	<div class="add-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="backToList('ListAlatLaboratorium')"
			>
				Batal
			</button>
			<button class="smil-btn smil-bg-primary" :disabled="!formFilled">
				Simpan
			</button>
		</div>
		<!-- END: BUTTON GROUP -->

		<!-- FORM GROUP -->
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
						v-model="formInput[form.model]"
						:placeholder="form.placeholder"
						:required="form.isRequired"
					/>
					<!-- END: INPUT TAG -->

					<!-- START: SELECT TAG -->
					<select
						v-if="form.type === 'select'"
						class="custom-select"
						v-model="formInput[form.model]"
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
			<div class="smil-row">
				<div class="form-group col-lg-6 col-12">
					<label class="form-label">Spesifikasi Alat</label>
				</div>
			</div>
		</section>
		<!-- FORM GROUP -->
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'add-alat-lab',
		components: {},
		mixins: [FormInputMixins],
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
						id: 1,
						label: 'Nama Alat',
						type: 'text',
						model: 'nama',
						description: '',
						placeholder: 'Nama Alat Baru',
						isRequired: true,
					},
					{
						id: 2,
						label: 'Asal Pengadaan Alat',
						type: 'select',
						model: 'asal',
						description: '',
						placeholder: 'Pilih Asal Pengadaan Alat',
						isRequired: true,
						options: [
							{
								id: 1,
								name: 'Pilih Asal Pengadaan Alat',
								value: '',
								disabled: true,
							},
							{
								id: 2,
								name: 'Barang Habis Pakai',
								value: 'BHP',
								disabled: false,
							},
							{
								id: 3,
								name: 'Hibah Tugas Akhir',
								value: 'HTA',
								disabled: false,
							},
							{
								id: 4,
								name: 'Supplier',
								value: 'SUP',
								disabled: false,
							},
							{
								id: 5,
								name: 'Direktorat PNJ',
								value: 'DRP',
								disabled: false,
							},
							{
								id: 6,
								name: 'Hibah Pemerintah',
								value: 'HPM',
								disabled: false,
							},
						],
					},
					{
						id: 3,
						label: 'Tahun Pengadaan Alat',
						type: 'text',
						model: 'tahun',
						description: '',
						placeholder: 'Tahun Pengadaan Alat',
						isRequired: true,
					},
					{
						id: 5,
						label: 'Jumlah Alat',
						type: 'number',
						model: 'jumlahAlat',
						description: '',
						placeholder: 'Jumlah Alat Baru',
						isRequired: true,
					},
					{
						id: 6,
						label: 'Jenis Alat',
						type: 'select',
						model: 'jenisAlat',
						description: '',
						placeholder: 'Pilih Jenis Alat',
						isRequired: true,
						options: [
							{
								id: 1,
								name: 'Pilih Jenis Alat',
								value: '',
								disabled: true,
							},
						],
					},
				],
				jenisAlatList: [
					{
						id: 1,
						nama: 'Laptop',
						attr_spek: ['Processor', 'Ukuran Layar', 'RAM', 'VGA'],
					},
				],
				spesifikasi: {},
			}
		},
		mounted() {
			this.getJenisAlat()
		},
		watch: {
			'formInput.asal': {
				deep: true,
				handler: function(newVal) {
					if (newVal === 'SUP') {
						let dataForm = {
							id: 4,
							label: 'Supplier Alat',
							type: 'select',
							model: 'supplier',
							description: '',
							placeholder: 'Pilih Supplier Alat',
							isRequired: false,
							options: this.supplierList(),
						}

						this.formGroupList.splice(3, 0, dataForm)
					} else {
						let indexSupplier = this.formGroupList.findIndex(
							(list) => list.id === 4
						)
						if (indexSupplier > -1) {
							this.formGroupList.splice(indexSupplier, 1)
						}
					}
				},
			},
			'formInput.jenisAlat': {
				handler: function() {
					let getJenisAlat = this.jenisAlatList.find(
						(jal) => jal.id === this.formInput.jenisAlat
					)

					getJenisAlat.attr_spek.forEach((spek) => {
						let key = spek.replace(/\s/, '_').toLowerCase() //Mengubah spek yg terdapat spasi dengan _
						this.spesifikasi[key] = {
							label: spek,
							value: key,
						}
						this.formInput.spesifikasi[key] = ''
					})
				},
			},
		},
		computed: {
			formFilled() {
				return (
					this.formInput.nama !== '' &&
					this.formInput.asal !== '' &&
					this.formInput.tahun !== '' &&
					this.formInput.jumlahAlat !== 0 &&
					this.formInput.jenisAlat !== ''
				)
			},
		},
		methods: {
			supplierList() {
				// Akan memanggil API Supplier
				return [
					{
						id: 1,
						name: 'Pilih Supplier Alat',
						value: '',
						disabled: true,
					},
					{
						id: 2,
						name: 'PT Anugerah Sejahtera',
						value: 1,
						disabled: false,
					},
				]
			},
			getJenisAlat() {
				// Akan memanggil API Jenis Alat
				let jenisAlat = this.formGroupList.find((list) => list.id === 6)

				// Looping berdasarkan jenis alat yg didapatkan
				jenisAlat.options.push({
					id: 2,
					name: 'Laptop',
					value: 1,
					disabled: false,
				})
			},
			backToList(routeTo) {
				let confirmCancel = confirm(
					'Apakah anda yakin ingin membatalkan tambah data?'
				)
				if (confirmCancel) {
					this.$router.push({ name: routeTo })
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.add-alat-lab {
		.section-form-group {
			margin-top: 30px;
		}
	}
</style>

<style lang="scss">
	.add-alat-lab {
		.form-control,
		.custom-select {
			color: #000;
			background-color: #fff;
			border-color: #c5c5c5;
			border-radius: 5px;
			&:focus {
				box-shadow: 0 0 0 5px #c5c5c5;
			}
			&:disabled {
				background-color: #c5c5c5;
				border-color: #696969;
			}

			height: 50px;
		}
	}
</style>
