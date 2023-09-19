<template>
  <a-modal title="Crop Image" width="50%" @cancel="closeModal" :footer="false">
    <div class="cropperContainer" >
      <Cropper
      type="img"
      :src="imageUrl"
      @change="change"
      class="circle-stencil"
      :stencil-props="{ aspectRatio: 1/1 }"
      />
    </div>
    <div class="steps-action">
      <a-form-item >
        <a-button class="modal-button" type="primary" html-type="submit" @click="cropImage">{{$t('global.save')}}</a-button>
      </a-form-item>
    </div>
    
  </a-modal>
</template>

<script>
import { ref } from 'vue-demi'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
export default {
  components: {
    Cropper,
  },
  props: {
    imageUrl: {
      type: String
    },
  },
  setup(props, { emit }) {
    const imgCoordinates = ref()
    const imgCanvas = ref()

    const change = ({ coordinates, canvas }) => {
      imgCoordinates.value = coordinates
      imgCanvas.value = canvas
		}

    const cropImage = () => {
      const canvas = imgCanvas.value
      canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var newImg = document.createElement('img')
        newImg.onload = function() {
          URL.revokeObjectURL(url);
        };
        newImg.src = url;
        const dataURL = canvas.toDataURL();

        emit("crop", dataURL)
        emit('closeModal')
      });
    }

    return {
      cropImage,
      change
    }
  }
}
</script>

<style scoped>
.cropperContainer {
  margin: auto;
  /* background-color: #d9d9d9; */
  padding: 20px;
}

.cropperControls {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
.ant-modal-content .ant-modal-footer { display: none !important; }
</style>