import type { Schema, Attribute } from "@strapi/strapi";

export interface DocumentationCodeBlock extends Schema.Component {
  collectionName: "components_documentation_code_blocks";
  info: {
    displayName: "Code Block";
    description: "A block of code with optional description";
  };
  attributes: {
    code: Attribute.Text & Attribute.Required;
    language: Attribute.String & Attribute.DefaultTo<"bash">;
    description: Attribute.Text;
  };
}

export interface DocumentationFeatureList extends Schema.Component {
  collectionName: "components_documentation_feature_lists";
  info: {
    displayName: "Feature List";
    description: "A list of features with icons and descriptions";
  };
  attributes: {
    features: Attribute.Component<"documentation.feature", true>;
  };
}

export interface DocumentationFeature extends Schema.Component {
  collectionName: "components_documentation_features";
  info: {
    displayName: "Feature";
    description: "A single feature with icon and description";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    icon: Attribute.String & Attribute.Required;
  };
}

export interface DocumentationKeyTakeaway extends Schema.Component {
  collectionName: "components_documentation_key_takeaways";
  info: {
    displayName: "Key Takeaway";
    description: "Important summary points in the documentation";
  };
  attributes: {
    content: Attribute.Text & Attribute.Required;
  };
}

export interface DocumentationProTip extends Schema.Component {
  collectionName: "components_documentation_pro_tips";
  info: {
    displayName: "Pro Tip";
    description: "Advanced tips and best practices";
  };
  attributes: {
    content: Attribute.Text & Attribute.Required;
  };
}

export interface DocumentationTextSection extends Schema.Component {
  collectionName: "components_documentation_text_sections";
  info: {
    displayName: "Text Section";
    description: "A section of documentation text with a heading";
  };
  attributes: {
    heading: Attribute.String;
    content: Attribute.RichText;
  };
}

export interface HeaderHeader extends Schema.Component {
  collectionName: "components_header_headers";
  info: {
    displayName: "header";
    icon: "database";
    description: "";
  };
  attributes: {
    headername: Attribute.String;
    value: Attribute.String;
  };
}

export interface SharedCodeBlock extends Schema.Component {
  collectionName: "components_shared_code_blocks";
  info: {
    displayName: "Code Block";
    description: "Code snippets with language specification";
  };
  attributes: {
    code: Attribute.Text & Attribute.Required;
    language: Attribute.String & Attribute.Required;
    description: Attribute.String;
  };
}

export interface SharedFeature extends Schema.Component {
  collectionName: "components_shared_features";
  info: {
    displayName: "Feature";
    description: "Feature display with icon";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.String & Attribute.Required;
    icon: Attribute.Enumeration<
      [
        "database",
        "users",
        "chart-line",
        "search",
        "download",
        "bookmark",
        "bell",
        "filter",
        "chart-bar",
        "history",
        "discord",
        "envelope",
        "book"
      ]
    > &
      Attribute.Required;
  };
}

export interface SharedSettings extends Schema.Component {
  collectionName: "components_shared_settings";
  info: {
    displayName: "Subscription Settings";
    icon: "database";
    description: "";
  };
  attributes: {
    searchLimit: Attribute.Integer & Attribute.Private & Attribute.DefaultTo<0>;
    exportLimit: Attribute.Integer & Attribute.Private & Attribute.DefaultTo<0>;
    apiAccess: Attribute.String & Attribute.Private & Attribute.DefaultTo<"none">;
    allowedDataColumns: Attribute.JSON & Attribute.Private & Attribute.DefaultTo<["*"]>;
    allowCopy: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    allowExport: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    supportLevel: Attribute.Enumeration<["community", "email", "priority", "dedicated"]> &
      Attribute.Required &
      Attribute.Private;
    allowedExportTypes: Attribute.JSON & Attribute.Private & Attribute.DefaultTo<["csv", "json"]>;
    period: Attribute.Enumeration<["month", "year", "weekly", "daily", "lifetime"]> &
      Attribute.Required &
      Attribute.Private &
      Attribute.DefaultTo<"month">;
    maxRecords: Attribute.BigInteger & Attribute.DefaultTo<"0">;
  };
}

declare module "@strapi/types" {
  export module Shared {
    export interface Components {
      "documentation.code-block": DocumentationCodeBlock;
      "documentation.feature-list": DocumentationFeatureList;
      "documentation.feature": DocumentationFeature;
      "documentation.key-takeaway": DocumentationKeyTakeaway;
      "documentation.pro-tip": DocumentationProTip;
      "documentation.text-section": DocumentationTextSection;
      "header.header": HeaderHeader;
      "shared.code-block": SharedCodeBlock;
      "shared.feature": SharedFeature;
      "shared.settings": SharedSettings;
    }
  }
}
