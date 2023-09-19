<template>
	<a-table class="common-table" v-if="patients.staffSummaryPatient?.length > 0" :dataSource="patients.staffSummaryPatient" :columns="patientsListColumns" :pagination="false" :customRow="customRow" @change="tableSorting">
		<template #bodyCell="{ column, text, record }">
			<template v-if="column.dataIndex === 'fullName'">
				<span v-if="arrayToObjact(screensPermissions, 63)">
          <router-link
						:to="{ name: 'PatientDetails', params: { udid: record.udid } }">
            {{
							record.fullName.length > 15
								? record.fullName.substring(0, 20) + "..."
								: record.fullName
						}}
          </router-link>
        </span>
				<span v-else>{{ text }}</span>
			</template>
			<template v-if="column.dataIndex === 'flag'">
				<span v-if="record.flag == 'Unknown'" class="patient-status" :style="{ backgroundColor: record?.color != '' ? record?.color : '#7FF000', }">
					<img src="@/assets/images/icons/question-sign.svg" />
				</span>

				<span v-else class="patient-status" :style="{ backgroundColor: record?.color != '' ? record?.color : '#7FF000', }">
					<!-- Plus icon -->
					<template v-if="record?.continueReading > 0">
						<span v-for="count in record?.continueReading" :key="count" class="plus-sign">
							<template v-if="!(count > 3)">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
									<path d="M5.68861 8.10526H3.99561V4.917H0.894745V3.39879H3.99561V0.210526H5.68861V3.39879H8.78948V4.917H5.68861V8.10526Z" fill="white" />
								</svg>
							</template>
						</span>
						<!-- <span v-for="reading in record?.continueReading" :key="reading" class="plus-sign">+</span> -->
					</template>
					<template v-else>
						<span class="plus-sign-none">&nbsp;</span>
					</template>
					<!-- Check mark -->
					<span class="check-mark" v-if="record?.reviewed">
						<svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg" >
							<path d="M1.37634 3.5L0 2.07021L0.5 1.5L1.37634 2.5L3.5 0.5L4 0.774468L1.37634 3.5Z" fill="white" />
						</svg>
					</span>
				</span>
			</template>
		</template>
	</a-table>
  <div v-else>
    <EmptyTable :text="$t('global.staffPatientsTable')" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { arrayToObjact } from "@/commonMethods/commonMethod";
import { useRoute, useRouter } from "vue-router";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";

const route = useRouter();

function customRow(record) {
	// if (arrayToObjectData(screensPermissions.value, 513, 'id')) {
	return {
		onClick: () => {
			// store.dispatch('clientInformation', record.udid).then(() => {
			route.push({
				name: "PatientDetails",
				params: { udid: record.udid },
			});
			// })
		},
	};
	// }
}

const patientsListColumns = [
	{
		title: "Status",
		dataIndex: "flag",
		key: "flag",
		ellipsis: true,
		width: 80,
		align: "center",
	},
	{
		title: "Name",
		dataIndex: "fullName",
		key: "fullName",
		ellipsis: true,
		sorter: (a, b) => a.fullName.localeCompare(b.fullName),
	},
	{
		title: "Last Reading",
		dataIndex: "lastReading",
		key: "lastReading",
		ellipsis: true,
		sorter: (a, b) => a.lastReading.localeCompare(b.lastReading),
	},

	{
		title: "Last Contacted",
		dataIndex: "lastContacted",
		key: "lastContacted",
		ellipsis: true,
		sorter: (a, b) => a.lastContacted.localeCompare(b.lastContacted),
	},
];
const store = useStore();
const router = useRoute();
const patients = computed(() => {
	return store.state.careCoordinatorSummary;
});
const staffSummaryMeta = store.getters.staffSummaryMeta;
let scroller = "";
let data = [];
onMounted(() => {
	store.dispatch("staffSummaryPatient", {
		id: router.params.udid,
		data: "?page=",
	});
	var tableContent = document.querySelector(".ant-table-body");

	tableContent?.addEventListener("scroll", (event) => {
		let maxScroll = event.target.scrollHeight - event.target.clientHeight;
		let currentScroll = event.target.scrollTop + 2;
		if (currentScroll >= maxScroll) {
			// you're at the bottom of the page
			let current_page = staffSummaryMeta.value.current_page + 1;

			if (current_page <= staffSummaryMeta.value.total_pages) {
				scroller = maxScroll;
				store.state.careCoordinatorSummary.staffSummaryMeta = "";

				data = patients.value.staffSummaryPatient;
				//store.state.patients.patientList = ""

				store
					.dispatch("staffSummaryPatient", {
						id: router.params.udid,
						data: "?page=" + current_page + store.getters.orderTable.value.data,
					})
					.then(() => {
						loadMoredata();
					});
			}
		}
	});
});

function loadMoredata() {
	const newData = patients.value.staffSummaryPatient;
	newData.forEach((element) => {
		data.push(element);
	});
	patients.value.staffSummaryPatient = data;
	var tableContent = document.querySelector(".ant-table-body");

	setTimeout(() => {
		tableContent.scrollTo(0, scroller);
	}, 50);
}
</script>

<style>
</style>
