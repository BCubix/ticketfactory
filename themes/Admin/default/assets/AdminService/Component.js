import { App } from '@/App';
import { Routing } from '@/Routing';
import { CategoriesForm } from '@Apps/Categories/CategoriesForm/CategoriesForm';
import { ParentCategoryPartForm } from '@Apps/Categories/CategoriesForm/ParentCategoryPartForm';
import { CategoriesList } from '@Apps/Categories/CategoriesList/CategoriesList';
import { EditCategoryLink } from '@Apps/Categories/CategoriesList/sc.EditCategoryLink';
import { CategoriesMenu } from '@Apps/Categories/CategoriesMenu/CategoriesMenu';
import { CreateCategory } from '@Apps/Categories/CreateCategory/CreateCategory';
import { EditCategory } from '@Apps/Categories/EditCategory/EditCategory';
import { ChangePassword } from '@Apps/ChangePassword/ChangePassword';
import { ContactRequestsForm } from '@Apps/ContactRequests/ContactRequestsForm/ContactRequestsForm';
import { ContactRequestsFilters } from '@Apps/ContactRequests/ContactRequestsList/ContactRequestsFilters/ContactRequestsFilters';
import { ContactRequestsList } from '@Apps/ContactRequests/ContactRequestsList/ContactRequestsList';
import { CreateContactRequests } from '@Apps/ContactRequests/CreateContactRequest/CreateContactRequest';
import { EditContactRequest } from '@Apps/ContactRequests/EditContactRequest/EditContactRequest';
import { ContentsForm } from '@Apps/Contents/ContentsForm/ContentsForm';
import { DisplayContentField } from '@Apps/Contents/ContentsForm/DisplayContentField';
import { DisplayContentForm } from '@Apps/Contents/ContentsForm/DisplayContentForm';
import { ContentsFilters } from '@Apps/Contents/ContentsList/ContentsFilters/ContentsFilters';
import { ContentsList } from '@Apps/Contents/ContentsList/ContentsList';
import { CreateContent } from '@Apps/Contents/CreateContent/CreateContent';
import { EditContent } from '@Apps/Contents/EditContent/EditContent';
import { ContentTypeFieldArrayForm } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/ContentTypeFieldArrayForm';
import { FieldArrayElem } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/FieldArrayElem';
import { MainPartFieldForm } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/MainPartFieldForm';
import { ContentTypesForm } from '@Apps/ContentTypes/ContentTypesForm/ContentTypesForm';
import { FieldElemWrapper, FieldFormControl } from '@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields';
import { ContentTypesFilters } from '@Apps/ContentTypes/ContentTypesList/ContentTypesFilters/ContentTypesFilters';
import { ContentTypesList } from '@Apps/ContentTypes/ContentTypesList/ContentTypesList';
import { CreateContentType } from '@Apps/ContentTypes/CreateContentType/CreateContentType';
import { EditContentType } from '@Apps/ContentTypes/EditContentType/EditContentType';
import { CreateEvent } from '@Apps/Events/CreateEvent/CreateEvent';
import { EditEvent } from '@Apps/Events/EditEvent/EditEvent';
import { AddEventMediaModal } from '@Apps/Events/EventsForm/EventMediaPart/AddEventMediaModal';
import { DisplayEventMediaElement } from '@Apps/Events/EventsForm/EventMediaPart/DisplayEventMediaElement';
import { DisplayMediaAddInformations, DisplayMediaInformations } from '@Apps/Events/EventsForm/EventMediaPart/DisplayMediaInformations';
import { EditEventMediaModal } from '@Apps/Events/EventsForm/EventMediaPart/EditEventMediaModal';
import { EventMediaPartForm } from '@Apps/Events/EventsForm/EventMediaPart/EventMediaPartForm';
import { EventDateRange } from '@Apps/Events/EventsForm/EventDateRange';
import { EventMainPartForm } from '@Apps/Events/EventsForm/EventMainPartForm';
import { EventParentCategoryPartForm } from '@Apps/Events/EventsForm/EventParentCategoryPartForm';
import { EventsPriceBlockForm } from '@Apps/Events/EventsForm/EventPriceBlockForm';
import { EventsDateBlockForm } from '@Apps/Events/EventsForm/EventsDateBlockForm';
import { EventsDateForm } from '@Apps/Events/EventsForm/EventsDateForm';
import { EventsForm } from '@Apps/Events/EventsForm/EventsForm';
import { EventsPriceForm } from '@Apps/Events/EventsForm/EventsPriceForm';
import { EventsFilters } from '@Apps/Events/EventsList/EventsFilters/EventsFilters';
import { EventsList } from '@Apps/Events/EventsList/EventsList';
import { ForgotPassword } from '@Apps/ForgotPassword/ForgotPassword';
import { FirstCardDashboard } from '@Apps/Home/FirstCardDashboard';
import { GraphChildrenDashboard } from '@Apps/Home/GraphChildrenDashboard';
import { Home } from '@Apps/Home/Home';
import { MainDashboard } from '@Apps/Home/MainDashboard';
import { GraphTabTitle } from '@Apps/Home/sc.Home';
import { SecondCardDashboard } from '@Apps/Home/SecondCardDashboard';
import { ThirdCardDashboard } from '@Apps/Home/ThirdCardDashboard';
import { CreateHook } from '@Apps/Hooks/CreateHook/CreateHook';
import { HooksForm } from '@Apps/Hooks/HooksForm/HooksForm';
import { HookTable } from '@Apps/Hooks/HooksList/HookTable/HookTable';
import { HookTableBody } from '@Apps/Hooks/HooksList/HookTable/HookTableBody';
import { HookTableBodyRow } from '@Apps/Hooks/HooksList/HookTable/HookTableBodyRow';
import { HooksList } from '@Apps/Hooks/HooksList/HooksList';
import { CreateImageFormat } from '@Apps/ImageFormat/CreateImageFormat/CreateImageFormat';
import { EditImageFormat } from '@Apps/ImageFormat/EditImageFormat/EditImageFormat';
import { ImageFormatForm } from '@Apps/ImageFormat/ImageFormatForm/ImageFormatForm';
import { ImageFormatGenerateForm } from '@Apps/ImageFormat/ImageFormatForm/ImageFormatGenerateForm';
import { ImageFormatParametersForm } from '@Apps/ImageFormat/ImageFormatForm/ImageFormatParametersForm';
import { ImageFormatsFilters } from '@Apps/ImageFormat/ImageFormatsList/ImageFormatsFilters/ImageFormatsFilters';
import { ImageFormatGenerate } from '@Apps/ImageFormat/ImageFormatsList/ImageFormatGenerate';
import { ImageFormatParameters } from '@Apps/ImageFormat/ImageFormatsList/ImageFormatParameters';
import { ImageFormatsList } from '@Apps/ImageFormat/ImageFormatsList/ImageFormatsList';
import { Login } from '@Apps/Login/Login';
import { LogsList, LogTags, LogUserName } from '@Apps/Logs/LogsList/LogsList';
import { DropzoneWrapper } from '@Apps/Medias/Components/DropzoneWrapper';
import { CreateMedia } from '@Apps/Medias/CreateMedia/CreateMedia';
import { EditMedia } from '@Apps/Medias/EditMedia/EditMedia';
import { MediaDataForm } from '@Apps/Medias/MediasForm/MediaDataForm';
import { MediaImageForm } from '@Apps/Medias/MediasForm/MediaImageForm';
import { MediasFilters } from '@Apps/Medias/MediasList/MediasFilters/MediasFilters';
import { MediasSorters } from '@Apps/Medias/MediasList/MediasFilters/MediasSorters';
import { RotatingIcons } from '@Apps/Medias/MediasList/MediasFilters/sc.Filters';
import { MediasList } from '@Apps/Medias/MediasList/MediasList';
import { MediasMenu } from '@Apps/Medias/MediasMenu/MediasMenu';
import { CreateMenu } from '@Apps/Menus/CreateMenu/CreateMenu';
import { DisplayMenuElement, RenderElement } from '@Apps/Menus/MenusList/MenuStructure/DisplayMenuElement';
import { MenuStructure } from '@Apps/Menus/MenusList/MenuStructure/MenuStructure';
import { DraggableBox } from '@Apps/Menus/MenusList/MenuStructure/sc.DraggableBox';
import { DroppableBox } from '@Apps/Menus/MenusList/MenuStructure/sc.DroppableBox';
import { MoveElementButton } from '@Apps/Menus/MenusList/MenuStructure/sc.MoveElementButton';
import { AddMenuElement } from '@Apps/Menus/MenusList/AddMenuElement';
import { MenuHeaderLine } from '@Apps/Menus/MenusList/MenuHeaderLine';
import { MenusList } from '@Apps/Menus/MenusList/MenusList';
import { UploadModule } from '@Apps/Modules/UploadModule/UploadModule';
import { ModulesFilters } from '@Apps/Modules/ModulesList/ModulesFilters/ModulesFilters';
import { ModulesList } from '@Apps/Modules/ModulesList/ModulesList';
import { CreatePage } from '@Apps/Pages/CreatePage/CreatePage';
import { EditPage } from '@Apps/Pages/EditPage/EditPage';
import { PagesBlocksPart } from '@Apps/Pages/PagesForm/PagesBlocksPart';
import { PageBlockColumnPart } from '@Apps/PageBlocks/PageBlocksForm/PageBlockColumnPart';
import { PagesForm } from '@Apps/Pages/PagesForm/PagesForm';
import { PagesFilters } from '@Apps/Pages/PagesList/PagesFIlters/PagesFilters';
import { PagesList } from '@Apps/Pages/PagesList/PagesList';
import { PagesMenu } from '@Apps/Pages/PagesMenu/PagesMenu';
import { CreatePageBlock } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlock';
import { EditPageBlock } from '@Apps/PageBlocks/EditPageBlock/EditPageBlock';
import { ImportPageBlock } from '@Apps/Pages/PagesForm/ImportPageBlock';
import { PageHistory } from '@Apps/Pages/PageHistory/PageHistory';
import { PageBlocksForm } from '@Apps/PageBlocks/PageBlocksForm/PageBlocksForm';
import { PageBlocksFilters } from '@Apps/PageBlocks/PageBlocksList/PageBlocksFilters/PageBlocksFilters';
import { PageBlocksList } from '@Apps/PageBlocks/PageBlocksList/PageBlocksList';
import { ParametersBlockForm } from '@Apps/Parameters/ParametersForm/ParametersBlockForm';
import { ParametersForm } from '@Apps/Parameters/ParametersForm/ParametersForm';
import { ParametersMenu } from '@Apps/Parameters/ParametersMenu/ParametersMenu';
import { CreateRedirection } from '@Apps/Redirections/CreateRedirection/CreateRedirection';
import { EditRedirection } from '@Apps/Redirections/EditRedirection/EditRedirection';
import { RedirectionsForm } from '@Apps/Redirections/RedirectionsForm/RedirectionsForm';
import { RedirectionsFilters } from '@Apps/Redirections/RedirectionsList/RedirectionsFilters/RedirectionsFilters';
import { RedirectionsList } from '@Apps/Redirections/RedirectionsList/RedirectionsList';
import { CreateRoom } from '@Apps/Rooms/CreateRoom/CreateRoom';
import { EditRoom } from '@Apps/Rooms/EditRoom/EditRoom';
import { RoomsForm } from '@Apps/Rooms/RoomsForm/RoomsForm';
import { RoomsMainPartForm } from '@Apps/Rooms/RoomsForm/RoomsMainPartForm';
import { RoomsSeatingPlanPartForm } from '@Apps/Rooms/RoomsForm/RoomsSeatingPlansPartForm';
import { RoomsFilters } from '@Apps/Rooms/RoomsList/RoomsFilters/RoomsFilters';
import { RoomsList } from '@Apps/Rooms/RoomsList/RoomsList';
import { CreateSeason } from '@Apps/Seasons/CreateSeason/CreateSeason';
import { EditSeason } from '@Apps/Seasons/EditSeason/EditSeason';
import { SeasonsForm } from '@Apps/Seasons/SeasonsForm/SeasonsForm';
import { SeasonsFilters } from '@Apps/Seasons/SeasonsList/SeasonsFilters/SeasonsFilters';
import { SeasonsList } from '@Apps/Seasons/SeasonsList/SeasonsList';
import { CreateTag } from '@Apps/Tags/CreateTag/CreateTag';
import { EditTag } from '@Apps/Tags/EditTag/EditTag';
import { TagsForm } from '@Apps/Tags/TagsForm/TagsForm';
import { TagsFilters } from '@Apps/Tags/TagsList/TagsFilters/TagsFilters';
import { TagsList } from '@Apps/Tags/TagsList/TagsList';
import { UploadTheme } from '@Apps/Themes/UploadTheme/UploadTheme';
import { ThemesList } from '@Apps/Themes/ThemesList/ThemesList';
import { CreateUser } from '@Apps/Users/CreateUser/CreateUser';
import { EditUser } from '@Apps/Users/EditUser/EditUser';
import { EditProfile } from '@Apps/Users/EditProfile/EditProfile';
import { CreateUserForm } from '@Apps/Users/UserForm/CreateUserForm';
import { EditUserForm } from '@Apps/Users/UserForm/EditUserForm';
import { EditProfileForm } from '@Apps/Users/ProfileForm/EditProfileForm';
import { UserFilters } from '@Apps/Users/UserList/UserFilters/UserFilters';
import { UserList } from '@Apps/Users/UserList/UserList';
import { CmtBreadCrumb } from '@Components/CmtBreadCrumb/CmtBreadCrumb';
import { StyledBreadCrumb } from '@Components/CmtBreadCrumb/sc.StyledBreadCrumb';
import {
    ActionButton,
    ActionFabButton,
    AddBlockButton,
    AddBlockFabButton,
    CreateButton,
    DeleteBlockFabButton,
    DeleteFabButton,
    EditFabButton,
} from '@Components/CmtButton/sc.Buttons';
import { CmtCard, CmtCardHeader } from '@Components/CmtCard/sc.CmtCard';
import { CmtDatePicker } from '@Components/CmtDatePicker/CmtDatePicker';
import { CmtDateTimePicker } from '@Components/CmtDateTimePicker/CmtDateTimePicker';
import { CmtDisplayMediaType } from '@Components/CmtDisplayMediaType/CmtDisplayMediaType';
import { CmtDragAndDropTableBody } from "@Components/CmtDragAndDrop/CmtDragAndDropTableBody";
import { CmtDragAndDropTableBodyRow } from "@Components/CmtDragAndDrop/CmtDragAndDropTableBodyRow";
import { CmtEditorField } from "@Components/CmtEditorField/CmtEditorField";
import { CmtEndPositionWrapper } from '@Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';
import { CmtBooleanFilters } from '@Components/CmtFilters/CmtBooleanFilters';
import { CmtCategoriesFilters } from '@Components/CmtFilters/CmtCategoriesFilters';
import { CmtMultipleSelectFilters } from '@Components/CmtFilters/CmtMultipleSelectFilters';
import { CmtSearchFilters } from '@Components/CmtFilters/CmtSearchFilters';
import { CmtSimpleSelectFilters } from '@Components/CmtFilters/CmtSimpleSelectFilter';
import { ClearBooleanButton, FilterChip } from '@Components/CmtFilters/sc.Filters';
import { CmtFormBlock } from '@Components/CmtFormBlock/CmtFormBlock';
import { CmtHistoryDate } from '@Components/CmtHistoryDate/CmtHistoryDate';
import { CmtImageCard } from "@Components/CmtImageField/CmtImageCard";
import { CmtImageField } from "@Components/CmtImageField/CmtImageField";
import { CmtMediaModal } from "@Components/CmtImageField/CmtMediaModal";
import { CmtMediaModalInfos } from "@Components/CmtImageField/CmtMediaModalInfos";
import { CmtMediaElement } from '@Components/CmtMediaElement/sc.MediaElement';
import { CmtPageTitle } from '@Components/CmtPage/CmtPageTitle/CmtPageTitle';
import { TitleTypography } from '@Components/CmtPage/CmtPageTitle/sc.TitleTypography';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { PageWrapper } from '@Components/CmtPage/CmtPageWrapper/sc.PageWrapper';
import { CmtPagination } from '@Components/CmtPagination/CmtPagination';
import { CmtPopover } from '@Components/CmtPopover/CmtPopover';
import { CmtRemoveButton } from '@Components/CmtRemoveButton/CmtRemoveButton';
import { CmtTabs } from '@Components/CmtTabs/CmtTabs';
import { CmtTextField } from '@Components/CmtTextField/CmtTextField';
import { CmtSlugInput } from '@Components/CmtSlugInput/CmtSlugInput';
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
import { CmtDisplayFlag } from '@Components/CmtDisplayFlag/CmtDisplayFlag';
import { checkComponent, checkString } from '@Services/utils/check';
import { CmtActiveField } from '@Components/CmtActiveField/CmtActiveField';
import { ActiveFieldBlock, SwitchActiveLabel, SwitchTextLabel } from '@Components/CmtActiveField/sc.ActiveFieldBlock';
import { CreatePageBlockFormat } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlockFormat';
import { LanguagesList } from '@Apps/Languages/LanguagesList/LanguagesList';
import { CreateLanguage } from '@Apps/Languages/CreateLanguage/CreateLanguage';
import { EditLanguage } from '@Apps/Languages/EditLanguage/EditLanguage';
import { LanguagesForm } from '@Apps/Languages/LanguagesForm/LanguagesForm';
import { AppProvider } from '@/Config/AppProvider';

const ComponentObj = {
    App: App,
    Routing: Routing,

    CategoriesForm: CategoriesForm,
    ParentCategoryPartForm: ParentCategoryPartForm,
    CategoriesList: CategoriesList,
    EditCategoryLink: EditCategoryLink,
    CategoriesMenu: CategoriesMenu,
    CreateCategory: CreateCategory,
    EditCategory: EditCategory,

    ChangePassword: ChangePassword,

    ContactRequestsForm: ContactRequestsForm,
    ContactRequestsFilters: ContactRequestsFilters,
    ContactRequestsList: ContactRequestsList,
    CreateContactRequests: CreateContactRequests,
    EditContactRequest: EditContactRequest,

    ContentsForm: ContentsForm,
    DisplayContentField: DisplayContentField,
    DisplayContentForm: DisplayContentForm,
    ContentsFilters: ContentsFilters,
    ContentsList: ContentsList,
    CreateContent: CreateContent,
    EditContent: EditContent,

    ContentTypeFieldArrayForm: ContentTypeFieldArrayForm,
    FieldArrayElem: FieldArrayElem,
    MainPartFieldForm: MainPartFieldForm,
    ContentTypesForm: ContentTypesForm,
    FieldElemWrapper: FieldElemWrapper,
    FieldFormControl: FieldFormControl,
    ContentTypesFilters: ContentTypesFilters,
    ContentTypesList: ContentTypesList,
    CreateContentType: CreateContentType,
    EditContentType: EditContentType,

    CreateEvent: CreateEvent,
    EditEvent: EditEvent,
    AddEventMediaModal: AddEventMediaModal,
    DisplayEventMediaElement: DisplayEventMediaElement,
    DisplayMediaAddInformations: DisplayMediaAddInformations,
    DisplayMediaInformations: DisplayMediaInformations,
    EditEventMediaModal: EditEventMediaModal,
    EventMediaPartForm: EventMediaPartForm,
    EventDateRange: EventDateRange,
    EventMainPartForm: EventMainPartForm,
    EventParentCategoryPartForm: EventParentCategoryPartForm,
    EventsPriceBlockForm: EventsPriceBlockForm,
    EventsDateBlockForm: EventsDateBlockForm,
    EventsDateForm: EventsDateForm,
    EventsForm: EventsForm,
    EventsPriceForm: EventsPriceForm,
    EventsFilters: EventsFilters,
    EventsList: EventsList,

    ForgotPassword: ForgotPassword,

    FirstCardDashboard: FirstCardDashboard,
    GraphChildrenDashboard: GraphChildrenDashboard,
    Home: Home,
    MainDashboard: MainDashboard,
    GraphTabTitle: GraphTabTitle,
    SecondCardDashboard: SecondCardDashboard,
    ThirdCardDashboard: ThirdCardDashboard,

    CreateHook: CreateHook,
    HooksForm: HooksForm,
    HookTable: HookTable,
    HookTableBody: HookTableBody,
    HookTableBodyRow: HookTableBodyRow,
    HooksList: HooksList,

    CreateImageFormat: CreateImageFormat,
    EditImageFormat: EditImageFormat,
    ImageFormatForm: ImageFormatForm,
    ImageFormatGenerateForm: ImageFormatGenerateForm,
    ImageFormatParametersForm: ImageFormatParametersForm,
    ImageFormatsFilters: ImageFormatsFilters,
    ImageFormatGenerate: ImageFormatGenerate,
    ImageFormatParameters: ImageFormatParameters,
    ImageFormatsList: ImageFormatsList,

    Login: Login,

    LogUserName: LogUserName,
    LogTags: LogTags,
    LogsList: LogsList,

    DropzoneWrapper: DropzoneWrapper,
    CreateMedia: CreateMedia,
    EditMedia: EditMedia,
    MediaDataForm: MediaDataForm,
    MediaImageForm: MediaImageForm,
    MediasFilters: MediasFilters,
    MediasSorters: MediasSorters,
    RotatingIcons: RotatingIcons,
    MediasList: MediasList,
    MediasMenu: MediasMenu,

    CreateMenu: CreateMenu,
    DisplayMenuElement: DisplayMenuElement,
    RenderElement: RenderElement,
    MenuStructure: MenuStructure,
    DraggableBox: DraggableBox,
    DroppableBox: DroppableBox,
    MoveElementButton: MoveElementButton,
    AddMenuElement: AddMenuElement,
    MenuHeaderLine: MenuHeaderLine,
    MenusList: MenusList,

    UploadModule: UploadModule,
    ModulesFilters: ModulesFilters,
    ModulesList: ModulesList,

    CreatePage: CreatePage,
    EditPage: EditPage,
    PagesBlocksPart: PagesBlocksPart,
    ImportPageBlock: ImportPageBlock,
    PagesForm: PagesForm,
    PagesFilters: PagesFilters,
    PagesList: PagesList,
    PagesMenu: PagesMenu,

    PageHistory: PageHistory,

    CreatePageBlock: CreatePageBlock,
    CreatePageBlockFormat: CreatePageBlockFormat,
    EditPageBlock: EditPageBlock,
    PageBlocksForm: PageBlocksForm,
    PageBlockColumnPart: PageBlockColumnPart,
    PageBlocksFilters: PageBlocksFilters,
    PageBlocksList: PageBlocksList,

    ParametersBlockForm: ParametersBlockForm,
    ParametersForm: ParametersForm,
    ParametersMenu: ParametersMenu,

    LanguagesList: LanguagesList,
    CreateLanguage: CreateLanguage,
    EditLanguage: EditLanguage,
    LanguagesForm: LanguagesForm,

    CreateRedirection: CreateRedirection,
    EditRedirection: EditRedirection,
    RedirectionsForm: RedirectionsForm,
    RedirectionsFilters: RedirectionsFilters,
    RedirectionsList: RedirectionsList,

    CreateRoom: CreateRoom,
    EditRoom: EditRoom,
    RoomsForm: RoomsForm,
    RoomsMainPartForm: RoomsMainPartForm,
    RoomsSeatingPlanPartForm: RoomsSeatingPlanPartForm,
    RoomsFilters: RoomsFilters,
    RoomsList: RoomsList,

    CreateSeason: CreateSeason,
    EditSeason: EditSeason,
    SeasonsForm: SeasonsForm,
    SeasonsFilters: SeasonsFilters,
    SeasonsList: SeasonsList,

    CreateTag: CreateTag,
    EditTag: EditTag,
    TagsForm: TagsForm,
    TagsFilters: TagsFilters,
    TagsList: TagsList,

    UploadTheme: UploadTheme,
    ThemesList: ThemesList,

    CreateUser: CreateUser,
    EditUser: EditUser,
    EditProfile: EditProfile,
    CreateUserForm: CreateUserForm,
    EditUserForm: EditUserForm,
    EditProfileForm: EditProfileForm,
    UserFilters: UserFilters,
    UserList: UserList,

    CmtBreadCrumb: CmtBreadCrumb,
    StyledBreadCrumb: StyledBreadCrumb,
    CreateButton: CreateButton,
    ActionButton: ActionButton,
    EditFabButton: EditFabButton,
    DeleteFabButton: DeleteFabButton,
    DeleteBlockFabButton: DeleteBlockFabButton,
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
    CmtImageField: CmtImageField,
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
    CmtTabs: CmtTabs,
    CmtTextField: CmtTextField,
    CmtSlugInput: CmtSlugInput,
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
