import React from "react";
import { View } from "react-native";
import { ProductPhotoField } from "./ProductPhotoField";
import { VegetableCatalogPicker } from "./VegetableCatalogPicker";
import type { VegetableCatalogItem } from "../types";
import type { ProductFormErrors } from "../validation";

interface ProductFormIdentityProps {
  imageUrl: string;
  displayImageUrl: string;
  initialName?: string;
  initialCatalogId?: string | null;
  errors: ProductFormErrors;
  onImageSelected: (permanentUrl: string, displayUrl: string) => void;
  onImageRemoved: () => void;
  onCatalogSelected: (item: VegetableCatalogItem | null) => void;
}

export const ProductFormIdentity: React.FC<ProductFormIdentityProps> = ({
  imageUrl,
  displayImageUrl,
  initialName,
  initialCatalogId,
  errors,
  onImageSelected,
  onImageRemoved,
  onCatalogSelected,
}) => (
  <View>
    <ProductPhotoField
      initialImageUrl={imageUrl}
      initialDisplayUrl={displayImageUrl}
      error={errors.imagUrl}
      onImageSelected={onImageSelected}
      onImageRemoved={onImageRemoved}
    />
    <VegetableCatalogPicker
      initialName={initialName}
      initialItemId={initialCatalogId}
      error={errors.catalogId}
      onSelect={onCatalogSelected}
    />
  </View>
);
