import { ImageDifferenceType } from '../../ContentsHistory/DifferencesTypes/ImageDifferenceType';
import { EntityDifferenceType } from '../../ContentsHistory/DifferencesTypes/EntityDifferenceType';
import { TextDifferenceType } from '../../ContentsHistory/DifferencesTypes/TextDifferenceType';
import { DateTimeDifferenceType } from '../../ContentsHistory/DifferencesTypes/DateTimeDifferenceType';
import { CollectionDifferenceType } from '../../ContentsHistory/DifferencesTypes/CollectionDifferenceType';
import { GroupDifferenceType } from '../../ContentsHistory/DifferencesTypes/GroupDifferenceType';

export const HISTORY_TYPE_FIELDS = {
    text: TextDifferenceType,
    wysiwyg: TextDifferenceType,
    image: ImageDifferenceType,
    category: EntityDifferenceType,
    content: (props) => <EntityDifferenceType displayName="title" {...props} />,
    event: EntityDifferenceType,
    datetime: DateTimeDifferenceType,
    date: (props) => <DateTimeDifferenceType format="DD/MM/YYYY" {...props} />,
    email: TextDifferenceType,
    number: TextDifferenceType,
    page: (props) => <EntityDifferenceType displayName="title" {...props} />,
    tag: EntityDifferenceType,
    textarea: TextDifferenceType,
    time: (props) => <DateTimeDifferenceType format="HH:mm" {...props} />,
    collection: CollectionDifferenceType,
    group: GroupDifferenceType,
};
