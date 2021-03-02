// https://www.mattbutton.com/redux-made-easy-with-redux-toolkit-and-typescript/
// https://dev.to/thatgalnatalie/how-to-get-started-with-redux-toolkit-41e
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum View {
  SINGLE,
  STRONGEST
}

export enum Emotion {
  JOY = "joy",
  FEAR = "fear",
  ANGER = "anger",
  SADNESS = "sadness"
}

export interface SelectedMap {
  view: View,
  emotion: Emotion
}

const initialState: SelectedMap = {
  view: View.SINGLE,
  emotion: Emotion.JOY
}

const selectedMapSlice = createSlice({
  name: "selectedMap",
  initialState,
  reducers: {
    setView(state, action: PayloadAction<View>) {
      state.view = action.payload;
    },
    setEmotion(state, action: PayloadAction<Emotion>) {
      state.emotion = action.payload;
    }
  }
});
export const { setView, setEmotion } = selectedMapSlice.actions;
export default selectedMapSlice.reducer