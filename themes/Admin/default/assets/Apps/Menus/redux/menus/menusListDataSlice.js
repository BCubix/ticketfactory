import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    menusListData: {},
};

const menusListDataSlice = createSlice({
    name: 'menuListData',
    initialState: initialState,
    reducers: {
        setMenusListData: (state, action) => {
            state.menusListData = { ...state.menusListData, ...action.payload };
        },
    },
});

export const { setMenusListData } = menusListDataSlice.actions;
export const menusListDataSelector = (state) => state.menusListData;
export default menusListDataSlice.reducer;
