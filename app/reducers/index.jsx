import { combineReducers } from 'redux'
import { labelReducerLarge } from './inputForm'
import { text2Reducer, titleReducer, compareReducer } from './visualizer'


const rootReducer = combineReducers({
	text2: text2Reducer,
	title: titleReducer,
	compare: compareReducer,
	labels: require('./inputForm').default,
	words: require('./visualizer').default
})

export default rootReducer
