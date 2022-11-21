const MEDIA_TYPE = [
    { name: 'image/png', type: 'image' },
    { name: 'image/jpg', type: 'image' },
    { name: 'image/jpeg', type: 'image' },
    { name: 'image/webp', type: 'image' },
    { name: 'image/gif', type: 'image' },
    { name: 'audio/midi', type: 'audio' },
    { name: 'audio/mpeg', type: 'audio' },
    { name: 'audio/webm', type: 'audio' },
    { name: 'audio/ogg', type: 'audio' },
    { name: 'audio/wav', type: 'audio' },
    { name: 'video/mp4', type: 'video' },
    { name: 'video/webm', type: 'video' },
    { name: 'video/ogg', type: 'video' },
    { name: 'video/mpeg', type: 'video' },
    { name: 'application/msword', type: 'word' },
    {
        name: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        type: 'word',
    },
    { name: 'application/vnd.ms-excel', type: 'excel' },
    { name: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', type: 'excel' },
    { name: 'application/vnd.ms-powerpoint', type: 'powerpoint' },
    {
        name: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        type: 'powerpoint',
    },
    { name: 'application/pdf', type: 'pdf' },
    { name: 'text/plain', type: 'text' },
];

export const getMediaType = (type) => {
    const returnType = MEDIA_TYPE.find((el) => el.name === type);

    if (!returnType) {
        return null;
    }

    return returnType.type;
};
