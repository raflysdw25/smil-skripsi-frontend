<template>
	<div class="base-modal-barcode">
		<div class="printable-barcode" id="printable-barcode">
			<div class="banner">
				<img src="@/assets/images/Logo_PNJ.png" class="img-barcode" alt="" />
				<h4 class="text">
					Laboratorium Teknik Informatika dan Komputer Politeknik Negeri Jakarta
				</h4>
			</div>
			<vue-barcode
				:value="barcodeValue"
				:text="displayText"
				width="3"
				class="barcode"
			/>
		</div>
		<div class="button-group" v-if="environment === 'production'">
			<button class="smil-btn smil-bg-primary" @click="printBarcode">
				Cetak Barcode
			</button>
		</div>
	</div>
</template>

<script>
	// Package
	import VueBarcode from 'vue-barcode'
	export default {
		name: 'base-modal-barcode',
		components: { VueBarcode },
		props: {
			barcodeValue: String,
			displayText: String,
		},
		methods: {
			async printBarcode() {},
		},
		computed: {
			environment() {
				return process.env.NODE_ENV
			},
		},
	}
</script>

<style lang="scss" scoped>
	.base-modal-barcode {
		box-sizing: border-box;
		img {
			width: 100px;
			height: 100px;
		}
		.printable-barcode {
			border: 1px solid;
			padding: 10px;
		}
		.barcode {
			display: flex;
			justify-content: center;
			margin-top: 10px;
		}
		.banner {
			display: flex;
			align-items: center;
			.text {
				padding-left: 10px;
				margin-bottom: 0;
				font-weight: 700;
				font-size: 20px;
				font-style: italic;
			}
		}

		.button-group {
			display: flex;
			margin-top: 50px;
			justify-content: flex-end;
		}
	}
</style>
