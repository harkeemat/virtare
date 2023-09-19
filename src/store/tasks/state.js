export default {
  tasksList:[],
  taskMeta:null,
  taskStatus: null,
  taskPriority: null,
  addTask: null,
  editTask:null,
  updateTask:null,
  taskTeamMember:null,
  taskDateFiletrs:null,
  taskCategory:{
    business:null,
    premium:null
  },
  incompleteAllTask:null,
  completedAllTask:null,
  completionSeries:null,
  completionOptions:null,
  addTaskSuccess: null,
  latestTask: null,
  taskPermissions:null,
  allTaskStatus:null,
  completeTaskRate:null,
  taskComplete:[],
  showTaskModalData:null,
  editTaskState:null,
  taskRoute: localStorage.getItem('taskRoute'),
  tasksListColumns:[
		{
			title: 'Priority ',
			dataIndex: 'priority',
			sorter: true
		},
		{
			title: 'Due Date ',
			dataIndex: 'dueDate',
			sorter: true
		},
		{
			title: 'Name',
			dataIndex: 'title',
			sorter: true,
			slots: {
				customRender: 'taskName'
			}
		},
		{
			title: 'Status ',
			dataIndex: 'taskStatus',
			sorter: true,
			slots: {
				customRender: 'status'
			}
		},

		{
			title: 'Category',
			dataIndex: 'category',
			sorter: true,
			slots: {
				customRender: 'category'
			}
		},

		{
			title: 'Assigned By',
			dataIndex: 'assignedBy',

			slots: {
				customRender: 'assigned'
			}
			// onFilter: (value, record) => record.assignedBy.indexOf(value) === 0,
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			slots: {
				customRender: 'action'
			}
		}
	],
}