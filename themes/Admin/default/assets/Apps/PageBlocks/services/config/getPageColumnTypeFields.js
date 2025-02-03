import AudioVideoFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/AudioVideoFieldType';
import CategoryLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/CategoryLinkFieldType';
import ContentEditorFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/ContentEditorFieldType';
import ContentLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/ContentLinkFieldType';
import DateFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/DateFieldType';
import DateTimeFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/DateTimeFieldType';
import EmailFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/EmailFieldType';
import FeatureLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/FeatureLinkFieldType';
import FileFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/FileFieldType';
import IframeFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/IframeFieldType';
import ImageFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/ImageFieldType';
import EventLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/EventLinkFieldType';
import ExternalLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/ExternalLinkFieldType';
import NumberFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/NumberFieldType';
import PageLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/PageLinkFieldType';
import SliderFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/SliderFieldType';
import TagLinkFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/TagLinkFieldType';
import TextareaFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/TextareaFieldType';
import TextFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/TextFieldType';
import TimeFieldType from '@Apps/PageBlocks/PageBlocksForm/PageColumnTypeModules/TimeFieldType';

export const PAGE_COLUMN_TYPE_FIELDS = {
    // basic fields
    date: DateFieldType,
    datetime: DateTimeFieldType,
    email: EmailFieldType,
    number: NumberFieldType,
    text: TextFieldType,
    textarea: TextareaFieldType,
    time: TimeFieldType,

    // Contents
    audioVideo: AudioVideoFieldType,
    wysiwyg: ContentEditorFieldType,
    file: FileFieldType,
    iframe: IframeFieldType,
    image: ImageFieldType,

    // Groups
    slider: SliderFieldType,

    // Links
    externalLink: ExternalLinkFieldType,
    content: ContentLinkFieldType,
    tag: TagLinkFieldType,
    event: EventLinkFieldType,
    category: CategoryLinkFieldType,
    page: PageLinkFieldType,
    feature: FeatureLinkFieldType,
};
