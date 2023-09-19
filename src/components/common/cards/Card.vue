<template>
<a-col :xl="xl" :sm="sm" :xs="xs">
    <div @click="handler(link, text)">
        <div class="topBox" :style="{'background-color': color}">
            <i class="fa fa-user-circle-o" aria-hidden="true"></i>
            <h5 :style="{'color': textColor}">{{ count }}</h5>
            <p :style="{'color': textColor}">{{ text}}</p>
        </div>
    </div>
</a-col>
</template>
<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import {
  startimeAdd,
  endTimeAdd,
  timeStamp,
} from "@/commonMethods/commonMethod";
export default {
    props: {
        count: {
            type: Number,
            required: true
        },
        link: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        xl: {
            type: Number
        },
        sm: {
            type: Number
        },
        xs: {
            type: Number
        },
        color: {
            type: String
        },
        textColor: {
            type: String
        },
        patientsFiltter: {
            type: Boolean
        }
    },
    link: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    xl: {
      type: Number,
    },
    sm: {
      type: Number,
    },
    color: {
      type: String,
    },
    textColor: {
      type: String,
    },
    patientsFiltter: {
      type: Boolean,
    },
    type: {
      type: String,
    },
  
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();

    function handler(event, text, type) {
      if (type) {
        router.push({
          name: event,
          query: {
            filter: text,
          },
        });
      } else {
        if (props.patientsFiltter == false) {
          router.push({
            name: event,
            query: {
              fromDate: store.getters.dateFilter.value.fromDate,
              toDate: store.getters.dateFilter.value.toDate,
              filter: text,
              timelineId:
                store.getters.dashboardTimeLineButton.value.globalCodeId,
            },
          });
        } else {
          router.push({
            name: event,
            query: {
              fromDate: timeStamp(startimeAdd(moment())),
              toDate: timeStamp(endTimeAdd(moment())),
              filter: text,
              timelineId: 122,
            },
          });
          emit("patientRedirect");
        }
      }
    }

    return {
      handler,
    };
  }
};
</script>

