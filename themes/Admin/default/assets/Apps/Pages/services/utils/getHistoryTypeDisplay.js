import { ImageDifferenceType } from '../../PageHistory/DifferencesTypes/ImageDifferenceType';
import { EntityDifferenceType } from '../../PageHistory/DifferencesTypes/EntityDifferenceType';
import { TextDifferenceType } from '../../PageHistory/DifferencesTypes/TextDifferenceType';

export const HISTORY_TYPE_FIELDS = {
    text: TextDifferenceType,
    wysiwyg: TextDifferenceType,
    image: ImageDifferenceType,
    category: EntityDifferenceType,
    content: (props) => <EntityDifferenceType displayName="title" />,
    event: EntityDifferenceType,
};
