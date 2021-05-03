<template>
	<div class="form-filter-data">
		<h4 class="title-form">
			{{ title }}
		</h4>
		<!-- START: FORM GROUP -->
		<section class="form-group-section">
			<div class="row-form">
				<div
					class="form-group"
					v-for="(fr, indexInput) in form"
					:key="`form-input-${indexInput}-${fr.id}`"
				>
					<label :for="`input-${indexInput + 1}`">
						{{ fr.label }}
						<span v-if="fr.isRequired" style="color: #dc3545; font-size: 14px">
							*
						</span>
					</label>
					<!-- START: INPUT TAG -->
					<input
						:type="fr.type"
						v-if="inputType.includes(fr.type)"
						class="form-control"
						v-model="inputData[fr.model]"
						:placeholder="fr.placeholder"
						:required="fr.isRequired"
					/>
					<!-- END: INPUT TAG -->

					<!-- START: SELECT TAG -->
					<select
						v-if="fr.type === 'select'"
						class="custom-select"
						v-model="inputData[fr.model]"
						:required="fr.isRequired"
					>
						<option
							v-for="(ops, indexOps) in fr.options"
							:key="`option-${fr.model}-${indexOps}-${ops.id}`"
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
		<!-- END: FORM GROUP -->
		<!-- START: BUTTON GROUP -->
		<div class="button-group">
			<button
				class="smil-btn smil-btn-small smil-bg-secondary"
				@click="closeModal"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-btn-small smil-bg-primary"
				:disabled="!formFilled"
				@click="implementFilter()"
			>
				Terapkan
			</button>
		</div>
		<!-- END: BUTTON GROUP -->
	</div>
</template>

<script>
	// Components

	export default {
		name: 'form-filter-data',
		props: {
			title: {
				type: String,
				default: 'Filter Data',
			},
			formInput: {
				type: Object,
				required: true,
			},
			form: {
				type: Array,
				required: false,
			},
			submitFunction: {
				type: Function,
				required: false,
			},
			closeModal: {
				type: Function,
				required: true,
			},
		},
		watch: {},
		mounted() {},
		data() {
			return {
				inputData: this.formInput,
				inputType: ['number', 'text', 'password'],
			}
		},
		methods: {
			implementFilter() {
				this.closeModal(true)
			},
		},
		computed: {
			formFilled() {
				return true
			},
		},
	}
</script>

<style lang="scss" scoped>
	.title-form {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 16px;
	}
	section {
		.form-group-section {
			// width: 100%;
			padding: 16px;
		}
	}
	.form-group {
		width: 100%;
	}
	.row-form {
		display: flex;
		flex-wrap: wrap;
	}
	.button-group {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 30px;
		button {
			&:first-child {
				margin-right: 12px;
			}
		}
	}
</style>
<style lang="scss"></style>
