<template>
	<div class="base-modal-barcode">
		<div class="text-center" v-if="loadingModal">
			<b-spinner style="color:#fff; width: 40px; height: 40px"></b-spinner>
		</div>
		<template v-else>
			<div
				class="printable-barcode"
				id="printable-barcode"
				ref="printable-barcode"
			>
				<div class="banner">
					<img src="@/assets/images/Logo_PNJ.png" class="img-barcode" alt="" />
					<h4 class="text">
						Laboratorium <br />
						Teknik Informatika dan Komputer <br />
						Politeknik Negeri Jakarta
					</h4>
				</div>
				<vue-barcode
					:value="barcodeValue"
					:text="`${displayText} - ${barcodeValue}`"
					width="3"
					class="barcode"
				/>
			</div>
			<div class="button-group" v-if="environment === 'development'">
				<button class="smil-btn smil-bg-primary" @click="printBarcode">
					<b-spinner style="color:#fff" v-if="loading"></b-spinner>
					<template v-else>Cetak Barcode</template>
				</button>
			</div>
		</template>
	</div>
</template>

<script>
	// Package
	import VueBarcode from 'vue-barcode'
	import html2pdf from 'html2pdf.js'

	export default {
		name: 'base-modal-barcode',
		components: { VueBarcode },
		data() {
			return {
				loading: false,
				loadingModal: false,
				canvasImage: null,
				options: {
					margin: [5, 5, 11, 5],
					filename: `${this.displayText}_BARCODE_${this.barcodeValue}`,
					image: { type: 'jpg', quality: 0.95 },
					html2canvas: { useCORS: true, dpi: 192, letterRendering: true },
					jsPdf: {
						unit: 'mm',

						format: 'a4',
						orientation: 'potrait',
					},
				},
			}
		},
		props: {
			barcodeValue: String,
			displayText: String,
		},
		async mounted() {},
		methods: {
			async printBarcode() {
				this.loading = true
				try {
					html2pdf(this.barcodeComponent, this.options)

					this.loading = false
				} catch (e) {
					this.loading = false
					console.log(e)
				}
			},
		},
		computed: {
			environment() {
				return process.env.NODE_ENV
			},
			barcodeComponent() {
				return this.$refs['printable-barcode']
			},
		},
	}
</script>

<style lang="scss" scoped>
	.base-modal-barcode {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		// height: 100%;
		.button-group {
			display: flex;
			margin-top: 50px;
			justify-content: flex-end;
		}
	}
</style>
<style lang="scss">
	@import '@/assets/css/barcode.scss';
</style>
