<template>
	<div class="base-filter">
		<select
			v-if="filter_type === 'select'"
			v-model="filter_value"
			class="custom-select"
			:class="filter_class"
		>
			<option
				:value="ops.value"
				v-for="(ops, indexList) in options"
				:key="`select-${ops.value}-${indexList}`"
				:disabled="ops.disabled"
			>
				{{ ops.text }}
			</option>
		</select>
		<div class="input-group" v-else-if="filter_type === 'search'">
			<input
				type="text"
				:placeholder="placeholder"
				v-model="filter_value"
				class="form-control"
				:class="filter_class"
			/>
			<div
				class="input-group-append"
				:class="filter_class"
				@click="filterAction"
			>
				<icon-component iconName="search" :size="16" colorIcon="#000" />
			</div>
		</div>
	</div>
</template>

<script>
	import IconComponent from '@/components/IconComponent.vue'
	export default {
		name: 'base-filter',
		components: { IconComponent },
		props: {
			filter_type: String,
			default_value: [String, Number],
			placeholder: String,
			options: Array,
			modelFilter: String,
			filter_class: String,
		},
		data() {
			return {
				filter_value: this.default_value,
			}
		},
		watch: {
			filter_value: function(value) {
				this.$emit('changeValue', {
					model: this.modelFilter,
					value: value,
				})
				if (this.filter_type === 'select') {
					this.$emit('filterAction')
				}
			},
		},
		methods: {
			filterAction() {
				this.$emit('filterAction')
			},
		},
	}
</script>

<style lang="scss">
	.base-filter {
		.custom-select,
		.form-control,
		.input-group-append {
			border-radius: 5px;
			height: 33px !important;
			font-size: 10px;
		}
		.input-group {
			display: flex;
			align-items: center;
			.form-control {
				border-right: none;
			}
			.input-group-append {
				&:hover {
					cursor: pointer;
				}
				border: 1px solid #c5c5c5;
				border-left: none;
				padding: 0.375rem 0.75rem;

				.icon-component {
					margin-right: 0;
					margin-top: -2px;
				}
			}
		}

		@media screen and (max-width: 992px) {
			.input-group {
				.form-control {
					// border-right: 1px solid #c5c5c5;
				}
				.input-group-append {
					// display: none;
				}
			}
		}
	}
</style>
