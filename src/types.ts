export type NasaSearchParams = {
  keywords: string;
  yearStart: number;
  mediaType: "audio" | "video" | "image";
};

export type NasaResponse = {
  collection: {
    version: string;
    href: string;
    items: ItemsType[];
  };
};

export type ItemsType = {
  href: string;
  data: DataType[];
  links: LinkType[];
};

export type DataType = {
  center: string;
  title: string;
  keywords: string[];
  location: string;
  nasa_id: string;
  date_created: string;
  media_type: string;
  description: string;
};

export type LinkType = {
  href: string;
  rel: string;
  render: string;
};
