import { shallowMount } from '@vue/test-utils'
import Inventory from '@/components/administration/inventory/Inventory.vue'

const factory = (values = {}) => {
  return shallowMount(Inventory, {
    data () {
      return {
        ...values
      }
    }
  })
}

describe('Inventory.vue', () => {
  it('does not render an error', () => {
    const wrapper = factory()
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
