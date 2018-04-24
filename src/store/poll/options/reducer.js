import { ADD_OPTION, REMOVE_OPTION, UPDATE_OPTION, UPDATE_OPTION_ORDER } from './actions'

export const INITIAL_STATE = {
  // [optionId]
  order: [],
  // options is a map with the optionId as the keys and
  // option data including results as the values
  data: {},
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_OPTION:
      return {
        ...state,
        order: [...state.order, action.payload.id],
        data: {
          ...state.data,
          [action.payload.id]: {
            id: action.payload.id,
            text: '',
            editing: true,
            votes: 0
          }
        }
      }

    case REMOVE_OPTION:
      const { [action.payload.id]: removedOption, ...newOptions } = state.data

      return {
        ...state,
        data: newOptions,
        order: state.order.filter((id) => id !== action.payload.id)
      }

    case UPDATE_OPTION:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.id]: {
            ...state.data[action.payload.id],
            ...action.payload.data
          }
        }
      }

    case UPDATE_OPTION_ORDER:
      return {
        ...state,
        order: [...action.payload.order]
      }
  
    default:
      return state
  }
}