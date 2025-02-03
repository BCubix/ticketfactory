import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

const initialState = {
    loadingGeneralInfos: false,
    errorGeneralInfos: null,
    generalInfos: null,
};

const generalInfosSlice = createSlice({
    name: 'generalInfos',
    initialState: initialState,
    reducers: {
        setGeneralInfos: (state, action) => {
            state.generalInfos = action.payload;
        },

        setLoading: (state, action) => {
            state.loadingGeneralInfos = action.payload;
        },
        setError: (state, action) => {
            state.errorGeneralInfos = action.payload;
        },
    },
});

export const getGeneralInfosData = () => async dispatch => {
    dispatch(setLoading(true));
    try {
        const response = await Api.generalInfosApi.getGraph();
        dispatch(setGeneralInfos(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
}

export const {
    setGeneralInfos,
    setLoading,
    setError,
} = generalInfosSlice.actions;
export const generalInfosSelector = (state) => state.generalInfos;
export default generalInfosSlice.reducer;