// import { dateFormat } from '../../commonMethods/commonMethod';

export const addInventorySuccess = async (state, inventory) => {
  state.addInventory = inventory;
}
export const allPatientsNames = async (state, data) => {
  state.allPatientsNames = data
}

export const inventory = async (state, inventories) => {
  state.inventoriesList = inventories.data.map(data => {
    ///data.isActive = data.isActive
    data.isAvailable = data.isAvailable == 1 ? '-' : 'Assigned'
    return data
  });
  state.inventoryMeta = inventories.meta.pagination
}

export const inventoryDetailsSuccess = async (state, inventory) => {
  //inventory.isActive = inventory.isActive;
  state.inventoryDetails = inventory;
}

export const updateInventorySuccess = async (state, inventories) => {
  state.updateInventory = inventories;
}

export const deleteInventorySuccess = async (state, inventories) => {
  state.deleteInventory = inventories;
}

export const deviceModalsListSuccess = async (state, inventories) => {
  state.deviceModalsList = inventories.map(item=>{
    item.name = item.modelNumber
    return item;
  });
}
export const inventoryError = async (state, error) => {
  state.inventoryError = error;
}