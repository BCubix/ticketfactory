export const getEventType = (parameters) => {
    const eventParameter = parameters?.find((el) => el.paramKey === 'default_events_type');
    if (eventParameter) {
        const name = eventParameter?.availableValue?.find(
            (el) => el.id === eventParameter?.paramValue
        )?.name;

        if (name) {
            return name;
        }
    }

    return 'Evènement';
};
