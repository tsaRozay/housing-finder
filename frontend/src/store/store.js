import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';


const rootReducer = combineReducers({
  // reducers will go here
});

const configureStore = async (preloadedState) => {
  let enhancer;
  
  if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
  } else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
  }

  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
