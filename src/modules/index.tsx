import { combineReducers } from "redux";
import address from "./address";

const rootReducer = combineReducers({
  address,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
