<template>
	<div class="base-modal-struktural">
		<div class="header">
			<h3 class="header-title">Struktural Laboratorium</h3>
			<b-icon
				icon="x"
				style="width:40px; height: 24px; cursor: pointer"
				@click="closeModal"
			/>
		</div>
		<div class="add-data">
			<template v-if="!inputActive">
				<button
					class="smil-btn smil-bg-primary smil-btn-small"
					@click="addInput"
				>
					Tambah Jabatan
				</button>
			</template>
			<template v-else>
				<div class="add-form">
					<input type="text" class="form-control mr-2" v-model="inputValue" />
					<button
						class="smil-btn smil-bg-primary smil-btn-small mr-2"
						:disabled="inputValue === ''"
					>
						Simpan
					</button>
					<b-icon
						icon="x-circle-fill"
						style="color: #dc3545; width: 18px; height: 18px; cursor: pointer"
						@click="closeInput"
					/>
				</div>
			</template>
		</div>
		<div class="table-section table-responsive-sm">
			<table class="table smil-table">
				<thead class="smil-thead">
					<th>ID Jabatan</th>
					<th>Nama Jabatan</th>
				</thead>
				<tbody class="smil-tbody" v-if="listJabatan.length === 0">
					<tr>
						<td colspan="2" class="text-center" style="padding:60px 0;">
							Tidak ada data yang dapat ditampilkan
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'base-modal-struktural',
		props: {
			closeModal: Function,
		},
		data() {
			return {
				inputActive: false,
				inputValue: '',
				listJabatan: [],
			}
		},
		methods: {
			addInput() {
				this.inputActive = true
			},
			closeInput() {
				this.inputActive = false
			},
		},
	}
</script>

<style lang="scss" scoped>
	.base-modal-struktural {
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header-title {
				font-size: 20px;
				margin-bottom: 0;
				font-weight: 700;
			}
		}

		.add-data {
			margin-top: 24px;
			.add-form {
				display: flex;
				align-items: center;
			}
		}

		.table-section {
			margin-top: 24px;
		}

		.form-control {
			width: 180px;
		}
	}
</style>
