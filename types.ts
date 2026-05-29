export interface World {
    name: string;
}

export interface DataCenter {
    name: string;
    worlds: World[];
}

export interface SourceFlags {
    craft: boolean;
    vendor: boolean;
    gather: boolean;
    hunt: boolean;
    market: boolean;
}

export interface GatheringData {
    gathering_type: string; // Maps core.enums.Gatherer | str
}

export interface HuntingData {
    drops_from: string[];
}

export interface ItemSales {
    cheapest_buying_price: number | null;
    price_dynamics: number | null;
    selling_velocity: number | null;
    sale_history: any[] | null; // typing matching list
}

export interface MarketSalesData {
    hq: ItemSales | null;
    nq: ItemSales | null;
}

export interface SharedMarketData {
    dc: DataCenter | null;
    sales: MarketSalesData | null;
}

export interface MarketListing {
    world: World;
    retainer_name: string;
    quantity: number;
    price: number;
    price_per_unit: number;
}

export interface MarketListingData {
    hq: MarketListing[] | null;
    nq: MarketListing[] | null;
}

export interface FullMarketData extends SharedMarketData {
    listings: MarketListingData | null;
}

export interface CraftingData {
    recipe_id: number;
    item_yield: number;
    // Maps tuple[list[SlimItem], list[int]]
    ingredients: [SlimItem[], number[]];
    craft_class: string; // Maps core.enums.Crafter | str
}

export interface VendorListing {
    currency: SlimItem;
    cost: number;
    amount: number;
}

export interface VendorData {
    listings: VendorListing[];
    chosen_listing: [string, VendorListing] | null; // Maps tuple[str, VendorListing]
}

export interface SlimItem {
    name: string;
    id: number;
    icon_url: string;
    craftable: CraftingData | null;
    gatherable: GatheringData | null;
    marketable: SharedMarketData | null;
    huntable: HuntingData | null;
    vendorable: VendorData | null;
}

// Inherits from SlimItem, overrides marketable block with real-time active listings
export interface Item extends SlimItem {
    marketable: FullMarketData | null;
}

export interface Material {
    item: Item;
    amount: number;
    flags: SourceFlags;
    ordeal: any | null; // core.ordealList.Ordeal implementation placeholder
    quality: boolean | null;
    is_enough_hq: boolean | null;
    is_enough_nq: boolean | null;
}

export interface SlimMaterial {
    item: SlimItem;
    amount: number;
    flags: SourceFlags;
    ordeal: any | null;
    quality: boolean | null;
    is_enough_hq: boolean | null;
    is_enough_nq: boolean | null;
}

export interface MaterialList {
    items: Record<string, Material>;
}

export interface WishlistEntry {
    item: Item;
    amount: number;
    quality: boolean;
}

export interface Wishlist {
    entries: Record<string, WishlistEntry>;
    server: World;
}

export interface Endeavor {
    wishlist: Wishlist;
    player_server: World;
    mid_mats: MaterialList;
    low_mats: MaterialList;
}

export interface OrdealListCraft {
    entries: SlimMaterial[];
}

export interface MarketRoute {
    total_cost: number;
    total_amount: number;
    listings: MarketListing[];
}

export interface MarketEntry {
    material: SlimMaterial;
    quality: boolean;
    route: MarketRoute;
    overall_price: number;
}

export interface OrdealListMarket {
    entries: MarketEntry[];
    overall_price: number;
    // Structure: route: dict[str, dict[str, list[MarketListing]]]
    route: Record<string, Record<string, MarketListing[]>>;
}

export interface VendorEntry {
    material: SlimMaterial;
    listings: Record<string, VendorListing>;
    chosen_listing: [string, VendorListing];
}

export interface OrdealListVendor {
    entries: VendorEntry[];
    currencies_needed: Record<string, [SlimItem, number]>;
}

export interface OrdealListGather {
    entries: SlimMaterial[];
}

export interface OrdealListHunt {
    entries: SlimMaterial[];
    targets: Record<string, [number, string[]]>; // dict[str, tuple[int, list[str]]]
}

export interface OrdealList {
    endeavor: Endeavor;
    craft: OrdealListCraft;
    market: OrdealListMarket;
    vendor: OrdealListVendor;
    gather: OrdealListGather;
    hunt: OrdealListHunt;
}