import CategoryMenuEntry from '@Apps/Menus/MenusList/MenuEntries/CategoryMenuEntry';
import EventMenuEntry from '@Apps/Menus/MenusList/MenuEntries/EventMenuEntry';
import ExternalLinkMenuEntry from '@Apps/Menus/MenusList/MenuEntries/ExternalLinkMenuEntry';
import PagesMenuEntry from '@Apps/Menus/MenusList/MenuEntries/PagesMenuEntry';
import RoomsMenuEntry from '@Apps/Menus/MenusList/MenuEntries/RoomsMenuEntry';
import SeasonMenuEntry from '@Apps/Menus/MenusList/MenuEntries/SeasonMenuEntry';
import TagMenuEntry from '@Apps/Menus/MenusList/MenuEntries/TagMenuEntry';

export const MENU_TYPES = {
    category: CategoryMenuEntry,
    event: EventMenuEntry,
    external: ExternalLinkMenuEntry,
    page: PagesMenuEntry,
    rooms: RoomsMenuEntry,
    season: SeasonMenuEntry,
    tag: TagMenuEntry,
};
