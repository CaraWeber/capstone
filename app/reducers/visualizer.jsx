import axios from 'axios';
const GET_WORDS = 'GET_WORDS';
const GET_COMP_TEXT ='GET_COMP_TEXT';
const GET_TITLE = 'GET_TITLE';
const SET_COMPARE = 'SET_COMPARE';

// action creator
export const getWords = words => ({
  type: GET_WORDS,
  words
});

// reducer
export const wordsReducer = (state={}, action) => {

  switch(action.type) {
    case GET_WORDS:
      return action.words
  }
  return state
};

//action creater for titles for sample models
export const getTitle = (graphtitle) => ({
	type: GET_TITLE,
	graphtitle
})

//reducer
export const titleReducer = (state="", action) => {
	switch(action.type) {
		case GET_TITLE:
			return action.graphtitle
	}
	return state
}

//action creater for changing compare (boolean) value
export const setCompare = (compare) => ({
	type: SET_COMPARE,
	compare
})

//reducer
export const compareReducer = (state=false, action) => {
	switch(action.type) {
		case SET_COMPARE:
			return action.compare
	}
	return state
}