<template>
	<div class="upload-image">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center justify-content-end">
			<button class="smil-btn smil-bg-danger mr-4" @click="$router.go(-1)">
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!uploadFilled"
				@click="submitNotif"
			>
				Simpan
			</button>
		</div>
		<!-- END: BUTTON GROUP -->
		<!-- START: UPLOAD IMAGE SECTION -->
		<div class="smil-row" @dragover.prevent>
			<!-- UPLOAD BOX -->
			<div
				class="upload-area col-lg-7"
				@dragover="setIsOver(true)"
				@dragleave="setIsOver(false)"
				:class="{ over: isOverUploadArea }"
				@drop.prevent="handleDropUpload"
			>
				<icon-component iconName="image" :size="52" colorIcon="#101939" />
				<p class="upload-area-desc">
					Drag & Drop Gambar atau
					<span
						@click="browseImage"
						:class="uploadFiles.length >= 3 ? 'disabled' : ''"
						>Klik Disini</span
					>
				</p>
				<input
					type="file"
					id="file_image"
					ref="file_image"
					accept=".png,.jpg,.jpeg"
					multiple
					class="d-none"
					@change="handleBrowseUpload"
				/>
			</div>
			<!-- UPLOAD BOX -->

			<!-- UPLOADED IMAGE -->
			<div class="uploaded-image col-lg-5">
				<h5 class="uploaded-image-title">Gambar Terunggah</h5>
				<div class="uploaded-image-display">
					<p class="uploaded-image-empty" v-if="uploadFiles.length === 0">
						Belum ada gambar yang diunggah
					</p>
					<template v-else>
						<div
							class="uploaded-image-box"
							v-for="(file, indexFile) in uploadFiles"
							:key="`uploaded-image-${indexFile}`"
						>
							<div class="image">
								<img :src="file.image" :alt="file.filename" />
							</div>
							<div class="image-info">
								<p>{{ file.filename }}</p>
								<span>{{ file.size }}</span>
								<span
									class="smil-link remove-link"
									@click="removeImage(indexFile)"
								>
									Hapus Gambar
								</span>
							</div>
						</div>
					</template>
				</div>
			</div>
			<!-- UPLOADED IMAGE -->
		</div>
		<!-- END: UPLOAD IMAGE SECTION -->

		<!-- MODAL POPUP -->
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
		<!-- MODAL POPUP -->
	</div>
</template>

<script>
	// Component
	import IconComponent from '@/components/IconComponent'
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'

	// Mixins
	import ModalMixins from '@/mixins/ModalMixins'
	import FormInputMixins from '@/mixins/FormInputMixins'

	// API
	import api from '@/api/admin_api'
	export default {
		name: 'upload-image',
		components: { IconComponent, BaseModalAlert },
		mixins: [ModalMixins, FormInputMixins],
		data() {
			return {
				isOverUploadArea: false,
				uploadFiles: [],
			}
		},
		methods: {
			// Call API
			async submitImage() {
				this.isCreate = true
				this.showAlert(true)
				try {
					const response = await api.createNewData(
						'image-alat',
						this.submitRequest
					)
					if (response.data.response.code === 201) {
						this.showAlert(false, true, response.data.response.message)
						this.isCreate = false
						setTimeout(() => {
							this.$router.go(-1)
						}, 2000)
					}
				} catch (e) {
					this.isCreate = false
					this.showAlert(false, false, e)
				}
			},
			// Upload Area Interaction
			setIsOver(is_over) {
				this.isOverUploadArea = is_over
			},
			browseImage() {
				if (this.uploadFiles.length < 3) {
					this.$refs['file_image'].click()
				}
			},
			// Upload Process
			handleDropUpload(e) {
				this.setIsOver(false)
				let uploadedFiles = e.dataTransfer.files
				console.log(uploadedFiles)
				this.imageUpload(uploadedFiles)
			},
			handleBrowseUpload() {
				let uploadedFiles = this.$refs.file_image.files
				console.log(uploadedFiles)
				this.imageUpload(uploadedFiles)
			},
			imageUpload(objectUpload) {
				let files = objectUpload
				for (let file of files) {
					let uploadFile = {}
					uploadFile.filename = file.name
					let fileSize = this.bytesToSize(file.size)
					if (fileSize.sizes === 'MB' && fileSize.total > 3) {
						continue
					} else {
						uploadFile.size = `${fileSize.total} ${fileSize.sizes}`
					}

					uploadFile.image = ''
					this.uploadFiles.push(uploadFile)
					this.createImage(this.uploadFiles.length - 1, file)
				}
			},
			// Image data manipulation
			bytesToSize(bytes) {
				let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
				if (bytes == 0) return '0 Byte'
				let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
				return {
					total: Math.round(bytes / Math.pow(1024, i), 2),
					sizes: sizes[i],
				}
			},
			createImage(index, file) {
				const reader = new FileReader()

				reader.onload = (e) => {
					this.uploadFiles[index].image = e.target.result
				}
				reader.readAsDataURL(file)
			},
			removeImage(indexImage) {
				this.uploadFiles.splice(indexImage, 1)
			},
			// Notif
			submitNotif() {
				let confirmSubmit = confirm(
					`Apakah anda sudah yakin ingin menyimpan ${
						this.uploadFiles.length > 1 ? 'gambar-gambar' : 'gambar'
					} ini?`
				)

				if (confirmSubmit) {
					this.submitImage()
				}
			},
		},
		computed: {
			uploadFilled() {
				return this.uploadFiles.length > 0
			},
			alatId() {
				return this.$route.params.alat_id
					? parseInt(this.$route.params.alat_id)
					: null
			},
			submitRequest() {
				let uploadFiles = this.uploadFiles
				let submit = []
				uploadFiles.forEach((file) => {
					submit.push(file.image)
				})

				return {
					alat_id: this.alatId,
					image_data_list: submit,
				}
			},
		},
		beforeRouteLeave(to, from, next) {
			if (!this.isCreate) {
				let confirmCancel = confirm(
					'Apakah anda yakin ingin membatalkan upload foto? Foto yang sudah diunggah tidak akan tersimpan'
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
	.upload-image {
		.upload-area,
		.uploaded-image {
			margin-top: 30px;
		}
		.upload-area {
			width: 100%;
			height: 330px;
			border: 1px dashed #696969;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-flow: column;
			.upload-area-desc {
				margin-top: 15px;
				color: #696969;
				span {
					color: #101939;
					font-weight: 700;
					&:hover {
						text-decoration: underline;
						cursor: pointer;
					}
					&.disabled {
						cursor: none;
						color: #c5c5c5;
						&:hover {
							text-decoration: none;
						}
					}
				}
			}
			&.over {
				background-color: #c5c5c5;
			}
		}
		.uploaded-image {
			.uploaded-image-title {
				font-weight: 700;
			}
			.uploaded-image-display {
				margin-top: 30px;
				.uploaded-image-empty {
					color: #696969;
					font-size: 16px;
				}
				.uploaded-image-box {
					display: flex;
					margin-bottom: 12px;
					.image {
						width: 120px;
						height: 120px;
						img {
							max-width: 120px;
							max-height: 120px;
						}
						// background-color: #696969;
						margin-right: 12px;
					}
					.image-info {
						font-size: 16px;
						display: flex;
						flex-flow: column;
						p {
							color: #000;
							font-weight: 700;
							margin-bottom: 5px;
						}
						span {
							color: #c5c5c5;
							&.remove-link {
								margin-top: auto;
								color: #101939;
								&:hover {
									text-decoration: underline;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
