export interface Station {
  code: string;
  name: string;
}

export interface BusStop {
  id: string;
  code: string;
  order: string;
  name: string;
}

export interface BusRoute {
  description: string;
  busStops: BusStop[];
}

export interface Bus {
  id: string;
  routes: BusRoute[];
}

export interface Tag {
  _id: string | undefined;
  name: string;
  color: string;
}

export interface ChartFinance {
  category: string;
  amount: number;
  description: string;
  tags?: Tag[];
}

export interface Finance {
  _id: string | undefined;
  amount: number;
  description: string;
  date: string;
  category: string;
  tags?: Tag[];
}

export interface Category {
  _id: string | undefined;
  description: string;
}

export interface Preset {
  _id: string | undefined;
  amount: number;
  description: string;
  category: string | undefined;
  tags?: Tag[] | undefined;
}
