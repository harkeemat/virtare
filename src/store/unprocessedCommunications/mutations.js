import { dateFormat } from "@/commonMethods/commonMethod"

export const unprocessedCommunications = (state, data) => {
  state.unprocessedCommunications = data.data.map(item => {
    item.from = (item.from).replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
    item.to = (item.to).replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
    item.createdAt = dateFormat(item.createdAt)
    return item;
  })
  state.unprocessedCommunicationsMeta = data.meta ? data.meta.pagination :''
}

export const communicationDetails = (state, data) => {
  state.communicationDetails = data
}