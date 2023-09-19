<template>
 <a-modal width="50%" title="Add Note" centered @cancel="onCloseModal()">
    <addNoteForm @closeModal="closeModal" @valueChanged="changedValue"/>
    <Loader />
 </a-modal>
</template>

<script>
import {
    computed,
    defineComponent,
    reactive,
    ref,
    watchEffect
} from "vue";
// import ModalButtons from "@/components/common/button/ModalButtons";
import {
    useStore
} from "vuex";
import {
    timeStamp
} from "@/commonMethods/commonMethod";
import {
    useRoute
} from "vue-router";
// import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import {
    warningSwal,
    globalDateFormat
} from "@/commonMethods/commonMethod";
import {
    messages
} from "../../config/messages";
import moment from "moment";
import Loader from "@/components/loader/Loader";

import addNoteForm from "./forms/AddNote.vue"

export default defineComponent({
    components: {
        // ModalButtons,
        Loader,
        // GlobalCodeDropDown
        addNoteForm
    },
    props: {
        pId: String,
    },
    setup(props, {
        emit
    }) {
        const store = useStore();
        const route = useRoute();
        const formRef = ref();
        const isValueChanged = ref(false);

        watchEffect(() => {
            // store.dispatch("globalCodes");
        });

        const flagsList = computed(() => {
            return store.state.flags.flagsList;
        });

        const noteTypes = computed(() => {
            return store.state.common.noteTypes;
        });
        const noteCategories = computed(() => {
            return store.state.common.noteCategories;
        });

        const addNoteForm = reactive({
            date: moment().format(globalDateFormat),
            category: "",
            type: "",
            flag: "",
            note: "",
            entityType: "patient",
        });
        const form = reactive({
            ...addNoteForm
        });

        const changedValue = (value) => {
            isValueChanged.value = value;
        };

        function onCloseModal() {
            emit("closeModal", {
                modal: "addNote",
                value: true,
            });
            if (isValueChanged.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        emit("closeModal", {
                            modal: "addNote",
                            value: false,
                        });
                        Object.assign(addNoteForm, form);
                        isValueChanged.value = false;
                    } else {
                        emit("closeModal", {
                            modal: "addNote",
                            value: true,
                        });
                    }
                });
            }
            else {
                emit("closeModal", {
                    modal: "addNote",
                    value: false,
                });
    
            }
        }

        const handleClear = () => {
            formRef.value.resetFields();
            Object.assign(addNoteForm, form);
        };

        const submitForm = () => {
            const data = {
                date: timeStamp(addNoteForm.date),
                category: addNoteForm.category,
                type: addNoteForm.type,
                flag: addNoteForm.flag,
                note: addNoteForm.note,
                entityType: addNoteForm.entityType,
            };
            const patientId = route.params.udid ? route.params.udid : props.pId;
            store.dispatch("addNote", {
                id: patientId,
                data: data
            }).then(() => {
                store.dispatch("latestNotes", patientId);
                store.dispatch("patientTimeline", {
                    id: patientId,
                    type: store.state.patients.tabvalue,
                });
                formRef.value.resetFields();
                Object.assign(addNoteForm, form);
                emit("closeModal", {
                    modal: "addNote",
                    value: false,
                });
                if (props.pId) {
                    store.dispatch("notesList", props.pId);
                }
            });
        };

        function closeModal(){
            emit("closeModal", false);
        }

        return {
            closeModal,
            size: ref("large"),
            handleClear,
            formRef,
            submitForm,
            addNoteForm,
            noteTypes,
            noteCategories,
            isValueChanged,
            changedValue,
            onCloseModal,
            flagsList,
            globalDateFormat,
        };
    },
});
</script>
