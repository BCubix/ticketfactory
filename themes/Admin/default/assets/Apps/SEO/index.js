import { SEOForm } from '@Apps/SEO/Form/SEOForm';

import { setComponent } from '@/AdminService/Component';

export const initComponent = () => {
    setComponent('SEOForm', SEOForm);
};
