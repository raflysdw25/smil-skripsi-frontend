import * as types from '@/store/types'

export default {
	[types.UPDATE_ADMIN]: ({ commit }, payload) => {
		commit(types.MUTATE_ADMIN, payload)
	},
}
