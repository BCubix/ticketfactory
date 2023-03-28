export const getSeoFormData = (formData, data) => {
    formData.append('seo[metaTitle]', data.seo.metaTitle);
    formData.append('seo[metaDescription]', data.seo.metaDescription);
    if (data.seo.socialImage) {
        formData.append('seo[socialImage]', data.seo.socialImage.id);
    }
    formData.append('seo[fbTitle]', data.seo.fbTitle);
    formData.append('seo[fbDescription]', data.seo.fbDescription);
    formData.append('seo[twTitle]', data.seo.twTitle);
    formData.append('seo[twDescription]', data.seo.twDescription);

    return formData;
}