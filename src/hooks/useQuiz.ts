import { useReducer } from "react";
import type { QuizState, QuizAction } from "@/types/quiz";

const TOTAL_STEPS = 5;

const initialState: QuizState = {
  step: 0,
  sex: null,
  goal: null,
  age: null,
  height: null,
  weight: null,
  activityLevel: null,
  training: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_SEX":
      return { ...state, sex: action.payload };
    case "SET_GOAL":
      return { ...state, goal: action.payload };
    case "SET_PERSONAL_INFO":
      return {
        ...state,
        age: action.payload.age,
        height: action.payload.height,
        weight: action.payload.weight,
      };
    case "SET_ACTIVITY":
      return { ...state, activityLevel: action.payload };
    case "SET_TRAINING":
      return { ...state, training: action.payload };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS - 1) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  return { state, dispatch, totalSteps: TOTAL_STEPS };
}
