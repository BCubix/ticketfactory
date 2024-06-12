import BooleanParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/BooleanParameterType';
import ImageFormatListParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/ImageFormatListParameterType';
import IntParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/IntParameterType';
import ListParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/ListParameterType';
import MultipleListParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/MultipleListParameterType';
import PageParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/PageParameterType';
import RoomParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/RoomParameterType';
import SeasonParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/SeasonParameterType';
import StringParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/StringParameterType';
import UploadParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/UploadParameterType';
import UrlParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/UrlParameterType';
import DefaultPriceParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/DefaultPriceParameterType';
import PasswordParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/PasswordParameterType';
import RequestButtonParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/RequestButtonParameterType';
import FloatParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/FloatParameterType';
import EventCategoryParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/EventCategoryParameterType';
import MediaCategoryParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/MediaCategoryParameterType';
import FontUploadParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/FontUploadParameterType';
import OpeningHoursParameterType from '@Apps/Parameters/ParametersForm/ParametersTypesModules/OpeningHoursParameterType';

export const parameterTypes = {
    bool: BooleanParameterType,
    ImageFormat: ImageFormatListParameterType,
    int: IntParameterType,
    list: ListParameterType,
    multipleList: MultipleListParameterType,
    Page: PageParameterType,
    EventCategory: EventCategoryParameterType,
    MediaCategory: MediaCategoryParameterType,
    Room: RoomParameterType,
    Season: SeasonParameterType,
    string: StringParameterType,
    upload: UploadParameterType,
    url: UrlParameterType,
    prices: DefaultPriceParameterType,
    password: PasswordParameterType,
    requestButton: RequestButtonParameterType,
    float: FloatParameterType,
    font: FontUploadParameterType,
    openingHours: OpeningHoursParameterType,
};
