import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    contentTypeKey: '',
    contentDataLoading: false,
    contentData: null,
    contentDataError: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('contentsActiveFilter')),
        title: sessionStorage.getItem('contentsTitleFilter') || '',
        contentType: sessionStorage.getItem('contentsContentTypeFilter') || '',
        sort: sessionStorage.getItem('contentsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const contentsSlice = createSlice({
    name: 'contents',
    initialState: initialState,
    reducers: {
        getContents: (state) => {
            state.loading = true;
        },

        getContentData: (state) => {
            state.contentDataLoading = true;
        },

        getContentsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.contentData[action.payload.key].contents = action.payload.contents;
            state.contentData[action.payload.key].total = action.payload.total;
        },

        getContentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contents = null;
        },

        getContentDataSuccess: (state, action) => {
            state.contentDataLoading = false;
            state.contentDataError = null;
            state.contentData = action.payload.contentData;
        },

        getContentDataFailure: (state, action) => {
            state.contentDataLoading = false;
            state.contentDataError = action.payload.error;
            state.contentData = null;
        },

        resetContents: (state) => {
            state = { ...initialState };
        },

        updateContentsFilters: (state, action) => {
            if (!state.contentData) {
                return;
            }

            state.contentData[action.payload.key].filters = action.payload.filters;
        },

        setContentTypeKey: (state, action) => {
            state.contentTypeKey = action.payload.contentTypeKey;
        },
    },
});

export function getContentsAction(contentTypeKey, filters = null) {
    return async (dispatch, getState) => {
        try {
            if (!contentTypeKey) {
                return;
            }

            dispatch(getContents());

            apiMiddleware(dispatch, async () => {
                const contentData = getState().contents?.contentData ? getState().contents.contentData[contentTypeKey] : null;
                if (!contentData || !contentData.contentType) {
                    return;
                }

                const state = filters || contentData.filters;

                const contents = await Api.contentsApi.getContents({ ...state, contentType: `${contentData.contentType.id}` });
                if (!contents.result) {
                    dispatch(getContentsFailure({ error: contents.error }));
                    return;
                }

                dispatch(getContentsSuccess({ key: contentTypeKey, contents: contents.contents, total: contents?.total }));
            });
        } catch (error) {
            dispatch(getContentsFailure({ error: error.message || error }));
        }
    };
}

export function getAllContentDataAction() {
    return async (dispatch, getState) => {
        try {
            dispatch(getContents());

            apiMiddleware(dispatch, async () => {
                const svContentTypes = getState().contents?.contentData || {};

                let contentTypes = await Api.contentTypesApi.getAllContentTypes({ pageType: false });
                if (!contentTypes.result) {
                    dispatch(getContentDataFailure({ error: contentTypes.error }));
                    return;
                }

                contentTypes = contentTypes.contentTypes;

                let contentTypesData = {};
                let item = null;
                let filters = null;
                let contents = null;
                for (let i = 0; i < contentTypes.length; i++) {
                    item = contentTypes[i];
                    filters = svContentTypes[`contentType_${item.id}`]?.filters || {
                        active: getBooleanFromString(sessionStorage.getItem(`contents_${item.id}_ActiveFilter`)),
                        title: sessionStorage.getItem(`contents_${item.id}_TitleFilter`) || '',
                        sort: sessionStorage.getItem(`contents_${item.id}_Sort`) || 'id ASC',
                        page: 1,
                        limit: 20,
                    };

                    contents = await Api.contentsApi.getContents({ ...filters, contentType: `${item.id}` });
                    if (!contents.result) {
                        dispatch(getContentDataFailure({ error: contents.error }));
                        return;
                    }

                    contentTypesData[`contentType_${item.id}`] = {
                        contentType: item,
                        filters: filters,
                        contents: contents?.contents,
                        total: contents?.total,
                    };
                }

                dispatch(getContentDataSuccess({ contentData: contentTypesData }));
            });
        } catch (error) {
            dispatch(getContentDataFailure({ error: error.message || error }));
            return;
        }
    };
}

export function changeContentsFilters(objectData, filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem(`contents_${objectData?.contentType?.id}_ActiveFilter`, filters?.active);
        sessionStorage.setItem(`contents_${objectData?.contentType?.id}_TitleFilter`, filters?.title);
        sessionStorage.setItem(`contents_${objectData?.contentType?.id}_Sort`, filters?.sort);

        filters.page = page;

        dispatch(updateContentsFilters({ key: `contentType_${objectData?.contentType?.id}`, filters: filters }));
        dispatch(getContentsAction(`contentType_${objectData?.contentType?.id}`, filters));
    };
}

export const { getContents, getContentsSuccess, getContentsFailure, resetContents, updateContentsFilters, getContentDataSuccess, getContentDataFailure, setContentTypeKey } =
    contentsSlice.actions;
export const contentsSelector = (state) => state.contents;
export default contentsSlice.reducer;
