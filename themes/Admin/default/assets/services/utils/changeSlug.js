import slugify from 'react-slugify';

export const changeSlug = (toSlug) => {
    return slugify(toSlug);
};
