<template>
	<a-alert @close="onCloseAlert(itemId)" v-if="closable" :message="text" :type="type" v-bind:class="isPin ? 'pinClass' : ''" closable/>
	<a-alert @close="onCloseAlert(itemId)" v-else :message="text" :type="type"/>
</template>

<script>

export default {
	props: {
		text: {
			type: String
		},
		type: {
			type: String
		},
		closable: {
			type: Boolean
		},
		isPin: {
			type: Boolean
		},
		itemId: {
			type: Number
		},
	},
	setup() {
		
		const onCloseAlert = () => {
			document.querySelectorAll('.critical-notes ul li')[0].remove();
		}

		return {
			onCloseAlert
		}
	}
}
</script>

<style>
	.ant-alert { width: 100%; }
	.pinClass {
		background-color: #fff!important;
		border: 4px solid #64BF7A !important;
	}
	.pinClass .ant-alert-message, .pinClass .anticon.anticon-close {
		color: #000 !important;
		font-size: 15px;
	}
	
</style>