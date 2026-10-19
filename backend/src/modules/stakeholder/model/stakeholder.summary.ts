export type CropCategoryBreakdown = {
  category: string;
  activeCount: number;
};

export type StakeholderSummary = {
  generatedAt: string;
  users: { sellers: number; buyers: number };
  listings: { total: number; active: number };
  orders: Record<string, number>;
  reports: { total: number };
  cropCategories: CropCategoryBreakdown[];
  rescueMetrics: {
    totalRescuedQty: number;
    fulfillmentRate: number;
  };
};
