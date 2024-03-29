import { App } from '@/App';
import { Routing } from '@/Routing';
import { SEOForm } from '@Apps/SEO/Form/SEOForm';
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
import { PageTypesForm } from '@Apps/ContentTypes/ContentTypesForm/PageTypesForm';
import { FieldElemWrapper, FieldFormControl } from '@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields';
import { ContentTypesFilters } from '@Apps/ContentTypes/ContentTypesList/ContentTypesFilters/ContentTypesFilters';
import { ContentTypesList } from '@Apps/ContentTypes/ContentTypesList/ContentTypesList';
import { PageTypesList } from '@Apps/ContentTypes/ContentTypesList/PageTypesList';
import { ContentTypesMenu } from '@Apps/ContentTypes/ContentTypesMenu/ContentTypesMenu';
import { CreateContentType } from '@Apps/ContentTypes/CreateContentType/CreateContentType';
import { CreatePageType } from '@Apps/ContentTypes/CreateContentType/CreatePageType';
import { EditContentType } from '@Apps/ContentTypes/EditContentType/EditContentType';
import { EditPageType } from '@Apps/ContentTypes/EditContentType/EditPageType';
import { CreateEvent } from '@Apps/Events/CreateEvent/CreateEvent';
import { EditEvent } from '@Apps/Events/EditEvent/EditEvent';
import { DisplayEventMediaElement } from '@Apps/Events/EventsForm/EventMediaPart/DisplayEventMediaElement';
import { CmtDisplayMediaInfos, CmtDisplayMediaMeta } from '@Components/CmtMediaInfos/CmtMediaInfos';
import { EditEventMediaModal } from '@Apps/Events/EventsForm/EventMediaPart/EditEventMediaModal';
import { EventMediaPartForm } from '@Apps/Events/EventsForm/EventMediaPart/EventMediaPartForm';
import { MoveEventMedias } from '@Apps/Events/EventsForm/EventMediaPart/MoveEventMedias';
import { DeleteEventMedias } from '@Apps/Events/EventsForm/EventMediaPart/DeleteEventMedias';
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
import { LoginBackgroundWrapper, LoginComponentWrapper, LoginPageWrapper } from '@Apps/Login/sc.Login';
import { LogsList, LogTags, LogUserName } from '@Apps/Logs/LogsList/LogsList';
import { CreateMediaCategory } from '@Apps/MediaCategories/CreateMediaCategory/CreateMediaCategory';
import { EditMediaCategory } from '@Apps/MediaCategories/EditMediaCategory/EditMediaCategory';
import { MediaCategoriesForm } from '@Apps/MediaCategories/MediaCategoriesForm/MediaCategoriesForm';
import { ParentMediaCategoryPartForm } from '@Apps/MediaCategories/MediaCategoriesForm/ParentMediaCategoryPartForm';
import { MediaCategoriesList } from '@Apps/MediaCategories/MediaCategoriesList/MediaCategoriesList';
import { DropzoneWrapper } from '@Apps/Medias/Components/DropzoneWrapper';
import { CreateMedia } from '@Apps/Medias/CreateMedia/CreateMedia';
import { EditMedia } from '@Apps/Medias/EditMedia/EditMedia';
import { MediaDataForm } from '@Apps/Medias/MediasForm/MediaDataForm';
import { IframeMediaForm } from '@Apps/Medias/MediasForm/IframeMediaForm';
import { MediaImageForm } from '@Apps/Medias/MediasForm/MediaImageForm';
import { MediaParentCategoryPartForm } from '@Apps/Medias/MediasForm/MediaParentCategoryPartForm';
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
import { ModulesMenu } from '@Apps/Modules/ModulesMenu/ModulesMenu';
import { UploadModule } from '@Apps/Modules/UploadModule/UploadModule';
import { ModulesList } from '@Apps/Modules/ModulesList/ModulesList';
import { CreatePage } from '@Apps/Pages/CreatePage/CreatePage';
import { EditPage } from '@Apps/Pages/EditPage/EditPage';
import { PagesBlocksPart } from '@Apps/Pages/PagesForm/PagesBlocksPart';
import { PageBlockColumnPart } from '@Apps/PageBlocks/PageBlocksForm/PageBlockColumnPart';
import { PagesForm } from '@Apps/Pages/PagesForm/PagesForm';
import { PagesBlocksSliderPart } from '@Apps/Pages/PagesForm/PagesBlocksSliderPart';
import { PagesFilters } from '@Apps/Pages/PagesList/PagesFilters/PagesFilters';
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
import { CustomersFilters } from '@Apps/Customers/CustomersList/CustomersFilters/CustomersFilters';
import { CustomersList } from '@Apps/Customers/CustomersList/CustomersList';
import { CreateCustomer } from '@Apps/Customers/CreateCustomer/CreateCustomer';
import { EditCustomer } from '@Apps/Customers/EditCustomer/EditCustomer';
import { CustomersForm } from '@Apps/Customers/CustomersForm/CustomersForm';
import { CartsList } from '@Apps/Carts/CartsList/CartsList';
import { CartsFilters } from '@Apps/Carts/CartsList/CartsFilters/CartsFilters';
import { CartsDetail } from '@Apps/Carts/CartsDetail/CartsDetail';
import { CustomerCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CustomerCartPart';
import { CartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartPart';
import { OrderCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/OrderCartPart';
import { VouchersList } from '@Apps/Vouchers/VouchersList/VouchersList';
import { CreateVoucher } from '@Apps/Vouchers/CreateVoucher/CreateVoucher';
import { EditVoucher } from '@Apps/Vouchers/EditVoucher/EditVoucher';
import { VouchersForm } from '@Apps/Vouchers/VouchersForm/VouchersForm';
import { VouchersFilters } from '@Apps/Vouchers/VouchersList/VouchersFilters/VouchersFilters';
import { OrdersList } from '@Apps/Orders/OrdersList/OrdersList';
import { OrdersFilters } from '@Apps/Orders/OrdersList/OrdersFilters/OrdersFIlters';
import { OrdersDetail } from '@Apps/Orders/OrdersDetail/OrdersDetail';
import { CartOrderPart } from '@Apps/Orders/OrdersDetail/OrdersDetailParts/CartOrderPart';
import { CustomerOrderPart } from '@Apps/Orders/OrdersDetail/OrdersDetailParts/CustomerOrderPart';
import { OrderPart } from '@Apps/Orders/OrdersDetail/OrdersDetailParts/OrderPart';
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
} from '@Components/CmtButton/sc.Buttons';
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
import { CreatePageBlockFormat } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlockFormat';
import { LanguagesList } from '@Apps/Languages/LanguagesList/LanguagesList';
import { CreateLanguage } from '@Apps/Languages/CreateLanguage/CreateLanguage';
import { EditLanguage } from '@Apps/Languages/EditLanguage/EditLanguage';
import { LanguagesForm } from '@Apps/Languages/LanguagesForm/LanguagesForm';
import { AppProvider } from '@/Config/AppProvider';

const ComponentObj = {
    App: App,
    Routing: Routing,

    SEOForm: SEOForm,

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
    PageTypesForm: PageTypesForm,
    FieldElemWrapper: FieldElemWrapper,
    FieldFormControl: FieldFormControl,
    ContentTypesFilters: ContentTypesFilters,
    ContentTypesList: ContentTypesList,
    PageTypesList: PageTypesList,
    ContentTypesMenu: ContentTypesMenu,
    CreateContentType: CreateContentType,
    EditContentType: EditContentType,
    CreatePageType: CreatePageType,
    EditPageType: EditPageType,

    CreateEvent: CreateEvent,
    EditEvent: EditEvent,
    DisplayEventMediaElement: DisplayEventMediaElement,
    CmtDisplayMediaInfos: CmtDisplayMediaInfos,
    CmtDisplayMediaMeta: CmtDisplayMediaMeta,
    EditEventMediaModal: EditEventMediaModal,
    EventMediaPartForm: EventMediaPartForm,
    MoveEventMedias: MoveEventMedias,
    DeleteEventMedias: DeleteEventMedias,
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

    CreateMediaCategory: CreateMediaCategory,
    EditMediaCategory: EditMediaCategory,
    MediaCategoriesForm: MediaCategoriesForm,
    ParentMediaCategoryPartForm: ParentMediaCategoryPartForm,
    MediaCategoriesList: MediaCategoriesList,

    DropzoneWrapper: DropzoneWrapper,
    CreateMedia: CreateMedia,
    EditMedia: EditMedia,
    MediaDataForm: MediaDataForm,
    IframeMediaForm: IframeMediaForm,
    MediaImageForm: MediaImageForm,
    MediaParentCategoryPartForm: MediaParentCategoryPartForm,
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
    ModulesList: ModulesList,
    ModulesMenu: ModulesMenu,

    CreatePage: CreatePage,
    EditPage: EditPage,
    PagesBlocksPart: PagesBlocksPart,
    ImportPageBlock: ImportPageBlock,
    PagesForm: PagesForm,
    PagesBlocksSliderPart: PagesBlocksSliderPart,
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

    CustomersList: CustomersList,
    CustomersFilters: CustomersFilters,
    CreateCustomer: CreateCustomer,
    EditCustomer: EditCustomer,
    CustomersForm: CustomersForm,

    CartsList: CartsList,
    CartsFilters: CartsFilters,
    CartsDetail: CartsDetail,
    CustomerCartPart: CustomerCartPart,
    CartPart: CartPart,
    OrderCartPart: OrderCartPart,

    VouchersList: VouchersList,
    VouchersFilters: VouchersFilters,
    CreateVoucher: CreateVoucher,
    EditVoucher: EditVoucher,
    VouchersForm: VouchersForm,

    OrdersList: OrdersList,
    OrdersFilters: OrdersFilters,
    OrdersDetail: OrdersDetail,
    CartOrderPart: CartOrderPart,
    CustomerOrderPart: CustomerOrderPart,
    OrderPart: OrderPart,

    CmtBreadCrumb: CmtBreadCrumb,
    StyledBreadCrumb: StyledBreadCrumb,
    CreateButton: CreateButton,
    ActionButton: ActionButton,
    SpecialActionButton: SpecialActionButton,
    EditFabButton: EditFabButton,
    DeleteFabButton: DeleteFabButton,
    DeleteButton: DeleteButton,
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
    CmtSelect: CmtSelect,

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
    LoginPageWrapper: LoginPageWrapper,
    LoginComponentWrapper: LoginComponentWrapper,
    LoginBackgroundWrapper: LoginBackgroundWrapper,
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
