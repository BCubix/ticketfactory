const MEDIA_TYPE = [
    { name: 'image/png', type: 'image' },
    { name: 'image/jpg', type: 'image' },
];

export const getMediaType = (type) => {
    const returnType = MEDIA_TYPE.find((el) => el.name === type);

    if (!returnType) {
        return null;
    }

    return returnType.type;
};
