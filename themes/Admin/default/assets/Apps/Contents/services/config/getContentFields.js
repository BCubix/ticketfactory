import AudioVideoFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/AudioVideoFieldContentType';
import CategoryLinkFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/CategoryLinkFieldContentType';
import CheckboxFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/CheckboxFieldContentType';
import ChoiceListFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/ChoiceListFieldContentType';
import CollectionFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/CollectionFieldContentType';
import ColorFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/ColorFieldContentType';
import ContentEditorFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/ContentEditorFieldContentType';
import ContentLinkFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/ContentLinkFieldContentType';
import DateFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/DateFieldContentType';
import DatetimeFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/DatetimeFieldContentType';
import EmailFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/EmailFieldContentType';
import EventLinkFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/EventLinkFieldContentType';
import ExternalLinkFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/ExternalLinkFieldContentType';
import FileFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/FileFieldContentType';
import GroupFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/GroupFieldContentType';
import IframeFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/IframeFieldContentType';
import ImageFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/ImageFieldContentType';
import MapFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/MapFieldContentType';
import NumberFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/NumberFieldContentType';
import PageLinkFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/PageLinkFieldContentType';
import PasswordFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/PasswordFieldContentType';
import RadioButtonFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/RadioButtonFieldContentType';
import SliderFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/SliderFieldContentType';
import TagLinkFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/TagLinkFieldContentType';
import TextareaFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/TextareaFieldContentType';
import TextFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/TextFieldContentType';
import TimeFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/TimeFieldContentType';
import TrueFalseFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/TrueFalseFieldContentType';
import FeatureFieldContentType from '@Apps/Contents/ContentsForm/ContentModules/FeatureFieldContentType';

export const CONTENT_FIELDS = {
    // basic fields
    date: DateFieldContentType,
    datetime: DatetimeFieldContentType,
    time: TimeFieldContentType,
    text: TextFieldContentType,
    number: NumberFieldContentType,
    textarea: TextareaFieldContentType,
    email: EmailFieldContentType,
    password: PasswordFieldContentType,

    // Choices
    radioButton: RadioButtonFieldContentType,
    checkbox: CheckboxFieldContentType,
    list: ChoiceListFieldContentType,
    trueFalse: TrueFalseFieldContentType,

    // Contents
    audioVideo: AudioVideoFieldContentType,
    map: MapFieldContentType,
    color: ColorFieldContentType,
    wysiwyg: ContentEditorFieldContentType,
    file: FileFieldContentType,
    iframe: IframeFieldContentType,
    image: ImageFieldContentType,

    // Groups
    collection: CollectionFieldContentType,
    group: GroupFieldContentType,
    slider: SliderFieldContentType,

    // Links
    externalLink: ExternalLinkFieldContentType,
    content: ContentLinkFieldContentType,
    tag: TagLinkFieldContentType,
    event: EventLinkFieldContentType,
    category: CategoryLinkFieldContentType,
    page: PageLinkFieldContentType,
    feature: FeatureFieldContentType,
};
