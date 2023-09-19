<template>
  <a-modal class="modalH-auto" max-width="1140px" width="60%" title="Select Template" centered :maskClosable="false"
    @cancel="closeModal()" :footer="false">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Dashboard">
        <a-row :gutter="20">
          <a-col :span="6">
            <div class="templateBox" @click="next">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Blank</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/blank.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>One Column</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/dashboard-one-column.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Two Column</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/dashboard-two-column.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Three Column</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/dashboard-three-column.jpg" alt="" />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Report" force-render>
        <a-row :gutter="20">
          <a-col :span="6">
            <div class="templateBox" @click="next">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Blank</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/blank.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Left Filter</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/report-left-filter.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Right Filter</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/report-right-filter.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Top Filter</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/report-top-filter.jpg" alt="" />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Form/Document">
        <a-row :gutter="20">
          <a-col :span="6">
            <div class="templateBox" @click="next">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Blank</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/blank.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>One Column</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/form-one-column.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Two Column</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/form-two-column.jpg" alt="" />
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="templateBox">
              <div class="templateHeader">
                <FileTextOutlined />
                <span>Below Grid</span>
              </div>
              <div class="templateBody">
                <img src="@//assets/images/custom-form/form-with-grid.jpg" alt="" />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <!-- <template #footer>
      <a-button>Cancel</a-button>
      <a-button type="primary" @click="next">Next</a-button>
    </template> -->
  </a-modal>
</template>
<script>
import { computed, ref, onUnmounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { FileTextOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    FileTextOutlined,
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const description = ref();

    // const record = computed(() => {
    //     return store.state.escalations.singleEscalationRecord;
    // })
    const iconLoading = ref(false);
    const submitForm = () => {
      iconLoading.value = true;
      store
        .dispatch("closeEscalation", {
          description: description.value,
          escalationId: props.escalationId,
        })
        .then((resp) => {
          if (resp == true) {
            emit("closeModal", false);
            store.dispatch("escalation");
          } else {
            iconLoading.value = false;
          }
        });
    };

    const addNote = () => {
      iconLoading.value = true;
      store
        .dispatch("escalationComment", {
          description: description.value,
          escalationId: props.escalationId,
        })
        .then((resp) => {
          if (resp == true) {
            emit("closeModal", false);
            store.dispatch("escalationAudit");
          } else {
            iconLoading.value = false;
          }
        });
    };

    const errorMsg = computed(() => {
      return store.state.authentication;
    });

    watchEffect(() => {
      if (errorMsg.value.errorMsg) {
        iconLoading.value = false;
      }
    });
    onUnmounted(() => {
      iconLoading.value = false;
      store.state.authentication.errorMsg = "";
    });

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    function closeModal() {
      //
    }

    const next = () => {
      router.push({
        path: "/admin/form-builder",
      });
    };

    return {
      next,
      addNote,
      checkChangeInput,
      closeModal,
      errorMsg,
      description,
      submitForm,
      router,
      iconLoading,
      activeKey: ref("1"),
    };
  },
};
</script>
  
<style lang="scss" scoped>
.templateBox {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: #1890ff;

    .templateHeader {
      color: #1890ff;
    }
  }

  .templateHeader {
    padding: 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    background-color: #f9f9f9;

    .anticon {
      margin-right: 20px;
    }
  }

  .templateBody {
    padding: 15px;
  }
}
</style>
  