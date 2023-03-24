// import {abilities} from "@/config/ability"

let initialState = {
    sales: []
}

export default {
    name: 'sale',
    namespaced: true,

    state: initialState,

    getters: {
        sales: (state) => state.sales
    },

    mutations: {
        SET_SALES: (state, payload) => {
            state.sales = payload
        },
        UPDATE_CONFIRMATION: (state, payload) => {
            state.sales = state.sales.map(
                item => {
                    if(item.id == payload.id) {
                        item.confirmation = payload.confirmation
                        console.log('sale updated');
                    }
                    return item
                }
            )
        },
        UPDATE_UPSELL: (state, payload) => {
            state.sales = state.sales.map(
                item => {
                    if(item.id == payload.id) {
                        item.upsell = payload.upsell
                        console.log('sale updated');
                    }
                    return item
                }
            )
        },
        UPDATE_AFFECTATION: (state, payload) => {
            state.sales = state.sales.map(
                item => {
                    if(item.id == payload.id) {
                        item.affectation = payload.affectation
                        console.log('sale updated');
                    }
                    return item
                }
            )
        },
        UPDATE_NOTE: (state, payload) => {
            state.sales = state.sales.map(
                item => {
                    if(item.id == payload.id) {
                        item.note = payload.note
                        console.log('sale updated');
                    }
                    return item
                }
            )
        },
        UPDATE_CONFIRMATION_WITH_NOTE: (state, payload) => {
            state.sales = state.sales.map(
                item => {
                    if(item.id == payload.id) {
                        item.confirmation = payload.confirmation
                        item.note = payload.note        
                        console.log('order updated');
                    }
                    return item
                }
            )
        },
        UPDATE_DELIVERY: (state, payload) => {
            state.sales = state.sales.map(
                item => {
                    if(item.id == payload.id) {
                        item.delivery = payload.delivery
                        console.log('sale updated');
                    }
                    return item
                }
            )
        },
    },

    actions: {
        setSales: ({ commit }, payload) => {
            commit('SET_SALES', payload)
        },
        updateConfirmation: ({ commit }, payload) => {
            commit('UPDATE_CONFIRMATION', payload)
        },
        updateUpsell: ({ commit }, payload) => {
            commit('UPDATE_UPSELL', payload)
        },
        updateAffectation: ({ commit }, payload) => {
            commit('UPDATE_AFFECTATION', payload)
        },
        updateNote: ({ commit }, payload) => {
            commit('UPDATE_NOTE', payload)
        },
        updateConfirmationWithNote: ({ commit }, payload) => {
            commit('UPDATE_CONFIRMATION_WITH_NOTE', payload)
        },
        updateDelivery: ({ commit }, payload) => {
            commit('UPDATE_DELIVERY', payload)
        },
    }
}