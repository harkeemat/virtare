<template>
    <div :class="className">
        <a-checkbox-group v-model:value="tab" @change="chnageTab('change')">
            <a-checkbox v-for="timeline in timeLineType" :key="timeline.id" :value="timeline.id">{{
                timeline.name
            }}</a-checkbox>
            <a-tooltip v-if="visibleRemoveAll" placement="bottom">
                <template #title>
                    <span>Unselect All</span>
                </template>
                <a class="icons close" @click="chnageTab('remove')">
                    <CloseCircleOutlined />
                </a>
            </a-tooltip>
        </a-checkbox-group>
        <div v-if="visibleRemoveAll" style="margin-top: 10px;">
            <a-input-search v-model:searchValue="value" allowClear="true"
                :placeholder="palcholder ? palcholder : 'Search...'" style="width: 100%" @input="handleChange"
                />
        </div>
        <div class="customBtn">
            <div v-if="value1.length > 0">
                <a-button type="primary" @click="showAddFlagModal">Clear Flag</a-button>
            </div>

            <a-checkbox v-if="checkBoxShow" v-model:checked="checkAll" @change="onCheckAllChange">
                Check all
            </a-checkbox>
        </div>

        <a-timeline class="defaultTimeline" style="height: calc(100vh - 350px)">
            <div v-if="
                patientTimeline &&
                patientTimeline != null &&
                patientTimeline.length > 0
            ">
                <a-checkbox-group v-model:value="value1" style="width: 100%" @change="onChangeCheckBox">
                    <template v-for="timeline in patientTimeline" :key="timeline.id">
                        <a-timeline-item color="blue">
                            <template #dot>
                                <BellOutlined class="yellowIcon" v-if="timeline.type == 1" />
                                <ClockCircleOutlined class="orangeIcon" v-if="timeline.type == 2" />
                                <HeatMapOutlined class="brownIcon" v-if="timeline.type == 3" />
                                <FolderOpenOutlined class="mustardIcon" v-if="timeline.type == 4" />
                                <FilePdfOutlined class="tealIcon" v-if="timeline.type == 5" />
                                <FileTextOutlined class="blueIcon" v-if="timeline.type == 6" />
                                <FlagOutlined class="redIcon" v-if="timeline.type == 7" />
                                <PushpinOutlined class="greenIcon" v-if="timeline.type == 8" />
                                <MessageOutlined class="messageIcon" v-if="timeline.type == 9" />
                                <FolderOpenOutlined class="mustardIcon" v-if="timeline.type == 10" />
                                <FolderOpenOutlined class="mustardIcon" v-if="timeline.type == 11" />
                                <BarChartOutlined class="purpleIcon" v-if="timeline.type == 12" />
                                <!-- <InfoCircleOutlined class="messageIcon" /> -->
                            </template>
                            <div class="timelineInner">
                                <div class="timelineHeader">
                                    <div class="title">
                                        <h4>{{ timeline.heading }}:</h4>
                                        <span class="time">{{
                                            moment(dateFormat(timeline.createdAt)).format(
                                                "DD-MM-YYYY"
                                            ) === moment().format("DD-MM-YYYY")
                                            ? moment(dateFormat(timeline.createdAt)).format(
                                                "hh:mm A"
                                            )
                                            : moment(dateFormat(timeline.createdAt)).format(
                                                "MMM DD, yyyy hh:mm A"
                                            )
                                        }}</span>
                                    </div>
                                    <div v-if="
                                        timeline.type == 7 &&
                                        timeline?.entity?.data &&
                                        timeline?.entity?.data?.isDelete == 0
                                    ">
                                        <a-checkbox v-model:value="timeline.entity.data.id"
                                            @click="checkBox"></a-checkbox>
                                    </div>
                                    <div class="title" v-else-if="timeline.type == 7 && timeline.entity.data">
                                        <router-link :to="{
                                            name: 'CoordinatorSummary',
                                            params: { udid: timeline.entity.data.deletedById },}">
                                            {{ timeline.entity.data.deletedBy + " " }} 
                                        </router-link>
                                        {{" &nbsp;" + $t("common.clearFlag")}}
                                        {{moment(dateFormat(timeline.entity.data.deletedAt))
                                        .format("DD-MM-YYYY") === moment().format("DD-MM-YYYY")? " " +
                                            moment(
                                                dateFormat(timeline.entity.data.deletedAt)
                                            ).format("hh:mm A")
                                            : " " +
                                            moment(
                                                dateFormat(timeline.entity.data.deletedAt)
                                            ).format("MMM DD, yyyy hh:mm A")
                                        }}
                                        {{
                                            timeline.entity.data.reason
                                                ? " " +
                                                $t("common.for") +
                                                " " +
                                                timeline.entity.data.reason
                                                : ""
                                        }}
                                    </div>
                                </div>
                                <div v-if="
                                    (timeline.type == 4 || timeline.type == 10) &&
                                    timeline.entity.data
                                " class="timelineBody">
                                    <p class="timeline-float timeline-title">
                                        <span>{{ timeline.title }}</span>
                                        <span v-if="
                                            timeline.entity.data.deviceType != 'Manual' &&
                                            timeline.entity.data.addType == 'Manual'
                                        "><strong>{{ " " + timeline.entity.data.addType }}</strong>,&nbsp;</span>
                                        <span v-if="
                                            timeline.entity.data.startTime ==
                                            timeline.entity.data.endTime
                                        ">&nbsp;Vitals Taken:
                                            {{
                                                " " +
                                                    moment(
                                                        dateFormat(timeline.entity.data.takeTime)
                                                    ).format("MMM DD, yyyy hh:mm A")
                                            }}</span>
                                        <span v-else>&nbsp;Vitals Time:
                                            {{
                                                " " +
                                                    moment(
                                                        dateFormat(timeline.entity.data.startTime)
                                                    ).format("MMM DD, yyyy hh:mm A") +
                                                    " - " +
                                                    moment(dateFormat(timeline.entity.data.endTime)).format(
                                                        "MMM DD, yyyy hh:mm A"
                                                    )
                                            }}</span>
                                    </p>
                                </div>
                                <div v-else class="timelineBody">
                                    <div class="content">
                                        <p class="timeline-float timeline-title">
                                            <span v-html="timeline.title"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a-timeline-item>
                    </template>
                </a-checkbox-group>
            </div>
            <div v-else class="noData">No Data</div>
        </a-timeline>
    </div>
    <PatientFlagsModal v-model:visible="flagsModalVisible" :patientId="pId" @closeModal="handleOk" :flags="flagsRecord"
        title="delete" />
</template>

<script>
import {
  FolderOpenOutlined,
  BarChartOutlined,
  FilePdfOutlined,
  BellOutlined,
  HeatMapOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PushpinOutlined,
  MessageOutlined,
  FlagOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import { dateFormat } from "@/commonMethods/commonMethod";
import {
  computed,
  ref,
  onMounted,
  reactive,
  toRefs,
  watchEffect,
  defineAsyncComponent,
} from "vue-demi";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
export default {
  components: {
    BarChartOutlined,
    FolderOpenOutlined,
    FilePdfOutlined,
    BellOutlined,
    HeatMapOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    PushpinOutlined,
    MessageOutlined,
    // InfoCircleOutlined,
    FlagOutlined,
    CloseCircleOutlined,
    //CheckCircleOutlined,
    PatientFlagsModal: defineAsyncComponent(() =>
      import("@/components/modals/PatientFlagsModal")
    ),
  },
  props: {
    className: {
      type: String,
    },
    profileId: {
      type: String,
    },
  },
  setup(props) {
    const custom = ref(false);
    const visibleRemoveAll = ref(false);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const checkBoxShow = ref(false);
    const searchValue = ref(null);
    const search = ref(null);
    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    });
    const pId = props.profileId ? ref(props.profileId) : route.params.udid;
    const flagsModalVisible = ref(false);
    const tabvalue = reactive({
      tab: [],
    });
    const state = reactive({
      value1: [],
      checkAll: false,
    });
    const patientTimeline = computed(() => {
      return store.state.patients.patientTimeline;
    });
    watchEffect(() => {
      if (store.state.patients.tabvalue.length > 0) {
        tabvalue.tab = store.state.patients.tabvalue;
        state.checkAll = false;
        visibleRemoveAll.value = true;
        showAllCheckBoxButton();
      }
      if (store.state.flags.clearFlag) {
        showAllCheckBoxButton();
        store.commit("clearFlag", false);
      }
    });

    const meta = store.getters.patientTimelineMeta;
    let data = [];
    let scroller = "";
    onMounted(() => {
      if (route.name == "PatientSummary") {
        store.dispatch("timeLineType").then(() => {
          if (route.query.filter) {
            store.state.patients.tabvalue = [4, 7];
            tabvalue.tab = store.state.patients.tabvalue;
            store
              .dispatch("patientTimeline", {
                id: route.params.udid ? route.params.udid : pId,
                type: store.state.patients.tabvalue.join(","),
                search: search.value,
              })
              .then(() => {
                showAllCheckBoxButton();
                visibleRemoveAll.value = tabvalue.tab.length > 0 ? true : false;
                store.commit("loadingTableStatus", false);
                showAllCheckBoxButton;
              });
          } else {
            if (store.state.patients.tabvalue.length == 0) {
              store
                .dispatch("patientTimeline", {
                  id: route.params.udid,
                  type: "",
                  search: search.value,
                })
                .then(() => {
                  showAllCheckBoxButton();
                });
            }
          }
        });
      } else if (route.name == "videoCall") {
        store.dispatch("timeLineType");
        store
          .dispatch("patientTimeline", {
            id: pId.value,
            type: "",
            search: search.value,
          })
          .then(() => {
            showAllCheckBoxButton();
          });
      }

      var tableContent = document.querySelector(".defaultTimeline");
      tableContent?.addEventListener("scroll", (event) => {
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 2;

        if (currentScroll >= maxScroll) {
          let current_page = meta.value.current_page + 1;
          if (current_page <= meta.value.total_pages) {
            scroller = maxScroll;
            meta.patientMeta = "";
            store.state.patients.patientTimelineMeta = "";
            data = patientTimeline.value;

            store
              .dispatch("patientTimeline", {
                page: current_page,
                id: route.params.udid,
                type: store.state.patients.tabvalue.join(","),
                search: search.value,
              })
              .then(() => {
                loadMoredata();
              });
          }
        }
      });
    });

    function showAllCheckBoxButton() {
      var count = 0;

      patientTimeline.value.length > 0
        ? patientTimeline.value.map((item) => {
            if (item.entity.data) {
              if (item?.entity?.data?.isDelete == 0) {
                count++;
              }
            }
          })
        : "";

      if (count == 0) {
        state.value1 = [];
        checkBoxShow.value = false;
      } else {
        checkBoxShow.value = true;
      }
    }

    function loadMoredata() {
      const newData = patientTimeline.value;
      newData.forEach((element) => {
        data.push(element);
      });
      store.state.patients.patientTimeline = data;
      var tableContent = document.querySelector(".defaultTimeline");
      setTimeout(() => {
        tableContent.scrollTo(0, scroller);
      }, 50);
    }
    //const check = ref(true)
    const showModalCustom = () => {
      custom.value = true;
    };

    function chnageTab(value) {
      state.value1 = [];
      state.checkAll = false;
      store.state.patients.tabvalue = [];
      store.commit("loadingTableStatus", true);
      var type = "";
      if (value == "change") {
        type = tabvalue.tab.length == 0 ? "" : tabvalue.tab.join(",");
        store.state.patients.tabvalue = tabvalue.tab;
      } else {
        router.replace({
          query: {},
        });
        tabvalue.tab.length = 0;
      }
      getTimeline(type);
    }
    function getTimeline(type) {
      store
        .dispatch("patientTimeline", {
          id: route.params.udid ? route.params.udid : pId.value,
          type: type,
          search: search.value,
        })
        .then(() => {
          if (tabvalue.tab.find((item) => item == 7)) {
            showAllCheckBoxButton();
          }
          visibleRemoveAll.value = tabvalue.tab.length > 0 ? true : false;
          store.commit("loadingTableStatus", false);
        });
    }
    const flagsRecord = ref([]);
    function showAddFlagModal() {
      flagsRecord.value = state.value1;
      flagsModalVisible.value = true;
    }
    const handleOk = ({ modal, value }) => {
      flagsModalVisible.value = value;

      if (value === false || modal == "xyz") {
        state.value1 = [];
        state.checkAll = false;
        showAllCheckBoxButton();
      }
    };
    const onCheckAllChange = (e) => {
      if (e.target.checked) {
        patientTimeline.value.map((item) => {
          if (item.type == 7 && item?.entity?.data?.isDelete == 0) {
            state.value1.push(item.entity.data.id);
          }
        });
      } else {
        state.value1 = [];
      }
    };

    function onChangeCheckBox() {
      var count = 0;
      patientTimeline.value.map((item) => {
        if (item.type == 7 && item?.entity?.data) {
          if (item?.entity?.data?.isDelete == 0) {
            count++;
          }
        }
      });
      if (count == state.value1.length) {
        state.checkAll = true;
      } else {
        state.checkAll = false;
      }
    }

    let timeout = "";

    const handleChange = (value) => {
      if (timeout && value.target.value != "") {
        clearTimeout(timeout);
        timeout = null;
      }
      search.value = value.target.value;
      fake();
      timeout = setTimeout(fake, 600);
    };

    function fake() {
      store.dispatch("patientTimeline", {
        id: route.params.udid ? route.params.udid : pId.value,
        type: store.state.patients.tabvalue.join(","),
        search: search.value,
      });
    }

    return {
      search,
      handleChange,
      searchValue,
      onChangeCheckBox,
      onCheckAllChange,
      handleOk,
      showAddFlagModal,
      pId,
      showModalCustom,
      custom,
      patientTimeline,
      timeLineType: store.getters.timeLineType,
      chnageTab,
      ...toRefs(tabvalue),
      moment,
      dateFormat,
      visibleRemoveAll,
      ...toRefs(state),
      flagsRecord,
      flagsModalVisible,
      patientDetails,
      checkBoxShow,
      showAllCheckBoxButton,
    };
  },
};
</script>

<style scoped>
p.timeline-float {
  display: inline-block;
}

.timelineBody .content {
  width: 100%;
}

p.timeline-float.timeline-title {
  width: 90%;
}

.close {
  position: sticky;
  top: 0;
  right: 0;
  background-color: #fff;
}

.noData.ant-timeline-item-last {
  position: relative;
  left: -20px !important;
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
}
</style>
