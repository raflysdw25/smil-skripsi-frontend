<template>
	<div class="add-supplier">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button
				class="smil-btn smil-bg-danger mr-4"
				@click="backToList('ListSupplier')"
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
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'add-supplier',
		mixins: [FormInputMixins],
		computed: {
			formFilled() {
				return (
					this.formGroupList[0].model !== '' &&
					this.formGroupList[1].model !== '' &&
					this.formGroupList[2].model !== ''
				)
			},
			addSupplierRequest() {},
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
		methods: {
			backToList(routeTo) {
				let confirmCancel = confirm(
					'Apakah anda yakin ingin membatalkan tambah supplier?'
				)
				if (confirmCancel) {
					this.$router.push({ name: routeTo })
				}
			},
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
