export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}; 

export const getItemValue = (key) => {
    const state = loadState();
    return state[key];
}  
export const setItemValue = (key, value) => {
    const state = loadState();
    const newState = { ...state, [key]: value };
    saveState(newState);
}

export const saveState = (state) => {
  try {
      const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};