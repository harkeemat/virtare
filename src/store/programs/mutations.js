export const program = async (state, data) => {
 
  state.programColumns = [
    {
      title: "Program Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
  ]
  state.manageProgramList = data.data.map((item, index) => {
    item.isActive = item.isActive == 1 ? true : false
    item.key = index
    return item
  })
  state.programMeta = data.meta ? data.meta.pagination : ''
}
export const programMsg = async (state, data) => {
  state.programMsg = data
}

export const activeProgramsList = async (state, data) => {
  state.activeProgramsList = data.data.map((item, index) => {
    item.isActive = item.isActive == 1 ? true : false
    item.key = index
    return item
  })
}

export const editProgram = async (state, data) => {
  state.editProgram = data.map((item) => {
    item.status = item.status == 1 ? true : false
    return item
  })
}


