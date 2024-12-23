import { ImageDifferenceType } from '../../PageHistory/DifferencesTypes/ImageDifferenceType';
import { EntityDifferenceType } from '../../PageHistory/DifferencesTypes/EntityDifferenceType';
import { TextDifferenceType } from '../../PageHistory/DifferencesTypes/TextDifferenceType';
import { DateTimeDifferenceType } from '../../PageHistory/DifferencesTypes/DateTimeDifferenceType';
import { CollectionDifferenceType } from '../../PageHistory/DifferencesTypes/CollectionDifferenceType';
import { GroupDifferenceType } from '../../PageHistory/DifferencesTypes/GroupDifferenceType';

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
