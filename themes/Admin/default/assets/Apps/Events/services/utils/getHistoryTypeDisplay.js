import { ImageDifferenceType } from '../../EventHistory/DifferencesTypes/ImageDifferenceType';
import { EntityDifferenceType } from '../../EventHistory/DifferencesTypes/EntityDifferenceType';
import { TextDifferenceType } from '../../EventHistory/DifferencesTypes/TextDifferenceType';
import { DateTimeDifferenceType } from '../../EventHistory/DifferencesTypes/DateTimeDifferenceType';
import { CollectionDifferenceType } from '../../EventHistory/DifferencesTypes/CollectionDifferenceType';
import { GroupDifferenceType } from '../../EventHistory/DifferencesTypes/GroupDifferenceType';
import { BooleanDifferenceType } from '../../EventHistory/DifferencesTypes/BooleanDifferenceType';

export const HISTORY_TYPE_FIELDS = {
    text: TextDifferenceType,
    wysiwyg: TextDifferenceType,
    image: ImageDifferenceType,
    boolean: BooleanDifferenceType,
    category: EntityDifferenceType,
    room: EntityDifferenceType,
    seatingPlan: EntityDifferenceType,
    ticketing: EntityDifferenceType,
    season: EntityDifferenceType,
    eventType: EntityDifferenceType,
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
