import { ImageDifferenceType } from '../../EventHistory/DifferencesTypes/ImageDifferenceType';
import { EntityDifferenceType } from '../../EventHistory/DifferencesTypes/EntityDifferenceType';
import { TextDifferenceType } from '../../EventHistory/DifferencesTypes/TextDifferenceType';
import { DateTimeDifferenceType } from '../../EventHistory/DifferencesTypes/DateTimeDifferenceType';
import { CollectionDifferenceType } from '../../EventHistory/DifferencesTypes/CollectionDifferenceType';
import { GroupDifferenceType } from '../../EventHistory/DifferencesTypes/GroupDifferenceType';
import { BooleanDifferenceType } from '../../EventHistory/DifferencesTypes/BooleanDifferenceType';
import { ChoiceDifferenceType } from '../../EventHistory/DifferencesTypes/ChoiceDifferenceType';
import { NumberDifferenceType } from '../../EventHistory/DifferencesTypes/NumberDifferenceType';

export const HISTORY_TYPE_FIELDS = {
    text: TextDifferenceType,
    number: NumberDifferenceType,
    wysiwyg: TextDifferenceType,
    image: ImageDifferenceType,
    boolean: BooleanDifferenceType,
    category: EntityDifferenceType,
    room: EntityDifferenceType,
    seatingPlan: EntityDifferenceType,
    choice: ChoiceDifferenceType,
    ticketing: EntityDifferenceType,
    feature: EntityDifferenceType,
    season: EntityDifferenceType,
    eventType: EntityDifferenceType,
    event: EntityDifferenceType,
    datetime: DateTimeDifferenceType,
    email: TextDifferenceType,
    tag: EntityDifferenceType,
    textarea: TextDifferenceType,
    collection: CollectionDifferenceType,
    group: GroupDifferenceType,
    featureValue: (props) => <EntityDifferenceType displayName="value" {...props} />,
    content: (props) => <EntityDifferenceType displayName="title" {...props} />,
    date: (props) => <DateTimeDifferenceType format="DD/MM/YYYY" {...props} />,
    page: (props) => <EntityDifferenceType displayName="title" {...props} />,
    time: (props) => <DateTimeDifferenceType format="HH:mm" {...props} />,
};
