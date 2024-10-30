import AudioVideoFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/AudioVideoFieldType';
import CategoryLinkFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/CategoryLinkFieldType';
import CheckboxFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/CheckboxFieldType';
import ChoiceListFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/ChoiceListFieldType';
import CollectionFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/CollectionFieldType';
import ColorFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/ColorFieldType';
import ContentEditorFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/ContentEditorFieldType';
import ContentLinkFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/ContentLinkFieldType';
import DateFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/DateFieldType';
import DatetimeFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/DatetimeFieldType';
import EmailFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/EmailFieldType';
import EventLinkFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/EventLinkFieldType';
import ExternalLinkFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/ExternalLinkFieldType';
import FileFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/FileFieldType';
import GroupFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/GroupFieldType';
import IframeFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/IframeFieldType';
import ImageFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/ImageFieldType';
import MapFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/MapFieldType';
import NumberFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/NumberFieldType';
import PageLinkFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/PageLinkFieldType';
import PasswordFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/PasswordFieldType';
import RadioButtonFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/RadioButtonFieldType';
import SliderFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/SliderFieldType';
import TagLinkFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/TagLinkFieldType';
import TextareaFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/TextareaFieldType';
import TextFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/TextFieldType';
import TimeFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/TimeFieldType';
import TrueFalseFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/TrueFalseFieldType';
import FeatureFieldType from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules/FeatureFieldType';

export const CONTENT_TYPE_FIELDS = {
    // basic fields
    date: DateFieldType,
    datetime: DatetimeFieldType,
    time: TimeFieldType,
    text: TextFieldType,
    number: NumberFieldType,
    textarea: TextareaFieldType,
    email: EmailFieldType,
    password: PasswordFieldType,

    // Choices
    radioButton: RadioButtonFieldType,
    checkbox: CheckboxFieldType,
    list: ChoiceListFieldType,
    trueFalse: TrueFalseFieldType,

    // Contents
    audioVideo: AudioVideoFieldType,
    color: ColorFieldType,
    wysiwyg: ContentEditorFieldType,
    file: FileFieldType,
    iframe: IframeFieldType,
    image: ImageFieldType,

    // Groups
    collection: CollectionFieldType,
    group: GroupFieldType,
    slider: SliderFieldType,

    // Links
    externalLink: ExternalLinkFieldType,
    content: ContentLinkFieldType,
    tag: TagLinkFieldType,
    event: EventLinkFieldType,
    category: CategoryLinkFieldType,
    page: PageLinkFieldType,
    feature: FeatureFieldType,
};
