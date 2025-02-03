import { MarketplaceConnectionDialog } from './Apps/MarketplaceConnection/MarketplaceConnectionDialog';
import marketplaceApi from './services/api/marketplaceApi';

import { setApi } from '@/AdminService/Api';
import { setComponent } from '@/AdminService/Component';

export const initApi = () => {
    setApi('marketplaceApi', marketplaceApi);
};

export const initComponent = () => {
    setComponent('MarketplaceConnectionDialog', MarketplaceConnectionDialog);
};
