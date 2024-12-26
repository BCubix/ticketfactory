import { App } from '@/App';
import { Routing } from '@/Routing';

import { CmtDisplayMediaInfos, CmtDisplayMediaMeta } from '@Components/CmtMediaInfos/CmtMediaInfos';
import { CmtMediaInfoBlock } from '@Components/CmtMediaInfos/sc.CmtMediaInfoBlock';
import { CmtBreadCrumb } from '@Components/CmtBreadCrumb/CmtBreadCrumb';
import { StyledBreadCrumb } from '@Components/CmtBreadCrumb/sc.StyledBreadCrumb';
import {
    ActionButton,
    SpecialActionButton,
    ActionFabButton,
    AddBlockButton,
    AddBlockFabButton,
    CreateButton,
    DeleteButton,
    DeleteBlockFabButton,
    DeleteFabButton,
    EditFabButton,
    DisabledBlockFabButton,
} from '@Components/CmtButton/sc.Buttons';
import { CmtAppMenu } from '@Components/CmtAppMenu/CmtAppMenu';
import { CmtCard, CmtCardHeader } from '@Components/CmtCard/sc.CmtCard';
import { CmtDatePicker } from '@Components/CmtDatePicker/CmtDatePicker';
import { CmtSelect } from '@Components/CmtSelect/CmtSelect';
import { CmtDateTimePicker } from '@Components/CmtDateTimePicker/CmtDateTimePicker';
import { CmtDisplayMediaType } from '@Components/CmtDisplayMediaType/CmtDisplayMediaType';
import { CmtDragAndDropTableBody } from '@Components/CmtDragAndDrop/CmtDragAndDropTableBody';
import { CmtDragAndDropTableBodyRow } from '@Components/CmtDragAndDrop/CmtDragAndDropTableBodyRow';
import { CmtEditorField } from '@Components/CmtEditorField/CmtEditorField';
import { CmtEndPositionWrapper } from '@Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';
import { CmtBooleanFilters } from '@Components/CmtFilters/CmtBooleanFilters';
import { CmtCategoriesFilters } from '@Components/CmtFilters/CmtCategoriesFilters';
import { CmtMultipleSelectFilters } from '@Components/CmtFilters/CmtMultipleSelectFilters';
import { CmtSearchFilters } from '@Components/CmtFilters/CmtSearchFilters';
import { CmtSimpleSelectFilters } from '@Components/CmtFilters/CmtSimpleSelectFilter';
import { ClearBooleanButton, FilterChip } from '@Components/CmtFilters/sc.Filters';
import { CmtFormBlock } from '@Components/CmtFormBlock/CmtFormBlock';
import { CmtHistoryDate } from '@Components/CmtHistoryDate/CmtHistoryDate';
import { CmtImageCard } from '@Components/CmtImageField/CmtImageCard';
import { CmtMediaModal } from '@Components/CmtImageField/CmtMediaModal';
import { CmtMediaModalInfos } from '@Components/CmtImageField/CmtMediaModalInfos';
import { CmtMediaElement } from '@Components/CmtMediaElement/sc.MediaElement';
import { CmtPageTitle } from '@Components/CmtPage/CmtPageTitle/CmtPageTitle';
import { TitleTypography } from '@Components/CmtPage/CmtPageTitle/sc.TitleTypography';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { PageWrapper } from '@Components/CmtPage/CmtPageWrapper/sc.PageWrapper';
import { CmtPagination } from '@Components/CmtPagination/CmtPagination';
import { CmtPopover } from '@Components/CmtPopover/CmtPopover';
import { CmtRemoveButton } from '@Components/CmtRemoveButton/CmtRemoveButton';
import { CmtSelectField } from '@Components/CmtSelectField/CmtSelectField';
import { CmtTabs } from '@Components/CmtTabs/CmtTabs';
import { CmtTextField } from '@Components/CmtTextField/CmtTextField';
import { CmtSlugInput } from '@Components/CmtSlugInput/CmtSlugInput';
import { CmtKeywordInput } from '@Components/CmtKeywordInput/CmtKeywordInput';
import { CmtTimePicker } from '@Components/CmtTimePicker/CmtTimePicker';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { LightEditor } from '@Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '@Components/Editors/LightEditor/sc.LightEditorFormControl';
import { Layout } from '@Components/Layout/Layout';
import { CmtTranslateDialog } from '@Components/CmtTranslateDialog/CmtTranslateDialog';
import { ListTable } from '@Components/ListTable/ListTable';
import { ListTableHead } from '@Components/ListTable/ListTableHead';
import { ListTableContextualMenu } from '@Components/ListTable/ListTableContextualMenu';
import { ListTableBodyLine } from '@Components/ListTable/ListTableBodyLine';
import { MenuItemButton, MenuTitle } from '@Components/SideMenu/sc.SideMenu';
import { SideMenu } from '@Components/SideMenu/SideMenu';
import { CmtImage } from '@Components/CmtImage/CmtImage';
import { CmtDisplayFlag } from '@Components/CmtDisplayFlag/CmtDisplayFlag';
import { checkComponent, checkString } from '@Services/utils/check';
import { CmtActiveField } from '@Components/CmtActiveField/CmtActiveField';
import { ActiveFieldBlock, SwitchActiveLabel, SwitchTextLabel } from '@Components/CmtActiveField/sc.ActiveFieldBlock';

import { AppProvider } from '@/Config/AppProvider';
import { CmtCrudList } from '@Components/CmtCrudList/CmtCrudList';
import { CmtCrudForm } from '@Components/CmtCrudForm/CmtCrudForm';
import { CmtFiltersList } from '@Components/CmtCrudList/CmtFiltersList';
import { CmtDisplayComponents } from '@Components/CmtDisplayComponents/CmtDisplayComponents';
import { CmtDisplayBlocks } from '@Components/CmtDisplayBlocks/CmtDisplayBlocks';
import { CmtDisplayFields } from '@Components/CmtDisplayFields/CmtDisplayFields';
import { CmtActiveBlock } from '@Components/CmtActiveBlock/CmtActiveBlock';
import { CmtDeleteMedias } from '../Components/CmtMediaPart/CmtDeleteMedias';
import { CmtDisplayMediaElement } from '../Components/CmtMediaPart/CmtDisplayMediaElement';
import { CmtEditMediaModal } from '../Components/CmtMediaPart/CmtEditMediaModal';
import { CmtMediaPartForm } from '../Components/CmtMediaPart/CmtMediaPartForm';
import { CmtMoveMedias } from '../Components/CmtMediaPart/CmtMoveMedias';
import { CmtFeaturesTypeValues } from '@Components/CmtFeaturesTypeValues/CmtFeaturesTypeValues';
import { CmtFeaturesInputField } from '@Components/CmtFeaturesInputField/CmtFeaturesInputField';
import { TRow } from '@Components/CmtDragAndDrop/sc.TRow';
import { TBody } from '@Components/CmtDragAndDrop/sc.TBody';

import { CmtSkeletonList } from '@Components/CmtSkeleton/CmtSkeletonList';
import { CmtSkeletonForm } from '@Components/CmtSkeleton/CmtSkeletonForm';
import {CmtSkeletonContentList} from '@Components/CmtSkeleton/CmtSkeletonContentList';
import { CmtSkeletonOrderDetails } from '@Components/CmtSkeleton/CmtSkeletonOrderDetails';
import { CmtSkeletonMenus } from '@Components/CmtSkeleton/CmtSkeletonMenus';

const ComponentObj = {
    App: App,
    Routing: Routing,

    CmtAppMenu: CmtAppMenu,

    CmtCrudList: CmtCrudList,
    CmtCrudForm: CmtCrudForm,
    CmtFiltersList: CmtFiltersList,

    CmtDisplayMediaInfos: CmtDisplayMediaInfos,
    CmtMediaInfoBlock: CmtMediaInfoBlock,
    CmtDisplayMediaMeta: CmtDisplayMediaMeta,

    CmtBreadCrumb: CmtBreadCrumb,
    StyledBreadCrumb: StyledBreadCrumb,
    CreateButton: CreateButton,
    ActionButton: ActionButton,
    SpecialActionButton: SpecialActionButton,
    EditFabButton: EditFabButton,
    DeleteFabButton: DeleteFabButton,
    DeleteButton: DeleteButton,
    DeleteBlockFabButton: DeleteBlockFabButton,
    DisabledBlockFabButton: DisabledBlockFabButton,
    ActionFabButton: ActionFabButton,
    AddBlockButton: AddBlockButton,
    AddBlockFabButton: AddBlockFabButton,
    CmtCard: CmtCard,
    CmtCardHeader: CmtCardHeader,
    CmtDatePicker: CmtDatePicker,
    CmtDateTimePicker: CmtDateTimePicker,
    CmtDisplayMediaType: CmtDisplayMediaType,
    CmtDragAndDropTableBody: CmtDragAndDropTableBody,
    CmtDragAndDropTableBodyRow: CmtDragAndDropTableBodyRow,
    CmtEditorField: CmtEditorField,
    CmtEndPositionWrapper: CmtEndPositionWrapper,
    CmtSelect: CmtSelect,
    CmtFeaturesTypeValues: CmtFeaturesTypeValues,
    CmtFeaturesInputField: CmtFeaturesInputField,

    CmtBooleanFilters: CmtBooleanFilters,
    CmtCategoriesFilters: CmtCategoriesFilters,
    CmtMultipleSelectFilters: CmtMultipleSelectFilters,
    CmtSearchFilters: CmtSearchFilters,
    CmtSimpleSelectFilters: CmtSimpleSelectFilters,
    ClearBooleanButton: ClearBooleanButton,
    FilterChip: FilterChip,
    CmtDisplayFlag: CmtDisplayFlag,

    CmtActiveField: CmtActiveField,
    ActiveFieldBlock: ActiveFieldBlock,
    SwitchActiveLabel: SwitchActiveLabel,
    SwitchTextLabel: SwitchTextLabel,
    CmtFormBlock: CmtFormBlock,
    AppProvider: AppProvider,
    CmtHistoryDate: CmtHistoryDate,

    CmtImageCard: CmtImageCard,
    CmtImage: CmtImage,
    CmtMediaModal: CmtMediaModal,
    CmtMediaModalInfos: CmtMediaModalInfos,

    CmtMediaElement: CmtMediaElement,
    CmtPageTitle: CmtPageTitle,
    TitleTypography: TitleTypography,
    CmtPageWrapper: CmtPageWrapper,
    PageWrapper: PageWrapper,

    CmtPagination: CmtPagination,
    CmtPopover: CmtPopover,
    CmtRemoveButton: CmtRemoveButton,
    CmtSelectField: CmtSelectField,
    CmtTabs: CmtTabs,
    CmtTextField: CmtTextField,
    CmtSlugInput: CmtSlugInput,
    CmtKeywordInput: CmtKeywordInput,
    CmtTimePicker: CmtTimePicker,
    CmtTranslateDialog: CmtTranslateDialog,
    DeleteDialog: DeleteDialog,
    LightEditor: LightEditor,
    LightEditorFormControl: LightEditorFormControl,
    Layout: Layout,
    ListTable: ListTable,
    ListTableHead: ListTableHead,
    ListTableContextualMenu: ListTableContextualMenu,
    ListTableBodyLine: ListTableBodyLine,
    MenuTitle: MenuTitle,
    MenuItemButton: MenuItemButton,
    SideMenu: SideMenu,
    TRow: TRow,
    TBody: TBody,

    CmtDisplayComponents: CmtDisplayComponents,
    CmtDisplayBlocks: CmtDisplayBlocks,
    CmtDisplayFields: CmtDisplayFields,
    CmtActiveBlock: CmtActiveBlock,

    CmtDeleteMedias: CmtDeleteMedias,
    CmtDisplayMediaElement: CmtDisplayMediaElement,
    CmtEditMediaModal: CmtEditMediaModal,
    CmtMediaPartForm: CmtMediaPartForm,
    CmtMoveMedias: CmtMoveMedias,

    CmtSkeletonList: CmtSkeletonList,
    CmtSkeletonForm: CmtSkeletonForm,
    CmtSkeletonContentList: CmtSkeletonContentList,
    CmtSkeletonOrderDetails: CmtSkeletonOrderDetails,
    CmtSkeletonMenus: CmtSkeletonMenus,
};

/**
 * Component's getter.
 */
export const Component = new Proxy(ComponentObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Component.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * Component's setter.
 *
 * @param  {string}          name
 * @param  {function|object} component
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setComponent(name, component) {
    checkString(name);
    checkComponent(component);

    ComponentObj[name] = component;
}
