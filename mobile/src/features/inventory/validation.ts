import type { CreateProductInput, UpdateProductInput } from "./types";

export interface ProductFormErrors {
  productName?: string;
  imagUrl?: string;
  productPrice?: string;
  productQty?: string;
  productType?: string;
  scalingType?: string;
  lowStockThreshold?: string;
  general?: string;
}

export function hasTwoDecimalsOrLess(val: number): boolean {
  if (!Number.isFinite(val)) return false;
  const scaled = val * 100;
  return Math.abs(scaled - Math.round(scaled)) < 0.00001;
}

export function validateCreateProduct(input: Partial<CreateProductInput>): {
  isValid: boolean;
  errors: ProductFormErrors;
} {
  const errors: ProductFormErrors = {};

  if (!input.productName || !input.productName.trim()) {
    errors.productName = "Please enter a product name.";
  }

  if (!input.imagUrl || !input.imagUrl.trim()) {
    errors.imagUrl = "Please upload a photo of the produce.";
  }

  if (input.productPrice === undefined || input.productPrice === null || isNaN(input.productPrice)) {
    errors.productPrice = "Please enter a selling price.";
  } else if (input.productPrice < 1 || input.productPrice > 99_999_999.99) {
    errors.productPrice = "Price must be between ₱1 and ₱99,999,999.99.";
  } else if (!hasTwoDecimalsOrLess(input.productPrice)) {
    errors.productPrice = "Price may have at most two decimal places.";
  }

  if (input.productQty === undefined || input.productQty === null || isNaN(input.productQty)) {
    errors.productQty = "Please enter available quantity.";
  } else if (input.productQty < 0.01 || input.productQty > 99_999_999) {
    errors.productQty = "Quantity must be between 0.01 and 99,999,999.";
  } else if (!hasTwoDecimalsOrLess(input.productQty)) {
    errors.productQty = "Quantity may have at most two decimal places.";
  }

  if (!input.productType) {
    errors.productType = "Please select a vegetable category.";
  }

  if (!input.scalingType) {
    errors.scalingType = "Please select a selling unit.";
  }

  if (input.lowStockThreshold !== undefined && input.lowStockThreshold !== null) {
    if (input.lowStockThreshold < 0 || input.lowStockThreshold > 99_999_999.99) {
      errors.lowStockThreshold = "Threshold must be a non-negative number.";
    } else if (!hasTwoDecimalsOrLess(input.lowStockThreshold)) {
      errors.lowStockThreshold = "Threshold may have at most two decimal places.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateProduct(input: Partial<UpdateProductInput>): {
  isValid: boolean;
  errors: ProductFormErrors;
} {
  const errors: ProductFormErrors = {};

  if (input.productName !== undefined && !input.productName.trim()) {
    errors.productName = "Please enter a product name.";
  }

  if (input.productPrice !== undefined) {
    if (isNaN(input.productPrice) || input.productPrice < 1 || input.productPrice > 99_999_999.99) {
      errors.productPrice = "Price must be between ₱1 and ₱99,999,999.99.";
    } else if (!hasTwoDecimalsOrLess(input.productPrice)) {
      errors.productPrice = "Price may have at most two decimal places.";
    }
  }

  if (input.lowStockThreshold !== undefined && input.lowStockThreshold !== null) {
    if (input.lowStockThreshold < 0 || input.lowStockThreshold > 99_999_999.99) {
      errors.lowStockThreshold = "Threshold must be a non-negative number.";
    } else if (!hasTwoDecimalsOrLess(input.lowStockThreshold)) {
      errors.lowStockThreshold = "Threshold may have at most two decimal places.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
