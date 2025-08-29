import type { Schema, Attribute } from '@strapi/strapi';

export interface HeaderHeader extends Schema.Component {
  collectionName: 'components_header_headers';
  info: {
    displayName: 'header';
    icon: 'database';
    description: '';
  };
  attributes: {
    headername: Attribute.String;
    value: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'header.header': HeaderHeader;
    }
  }
}
