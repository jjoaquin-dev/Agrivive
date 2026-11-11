---
title: Vegetable Catalog Sources
type: reference
last_updated: 2026-11-11
---

# Vegetable Catalog Sources

Up: [[00 Home]] · Related: [[2026-10-11 Vegetable Catalog and Naming]]

Where the vegetable catalog comes from. The catalog is a list of the vegetables sold in Davao wet markets that Agrivive supports. It is not a full list of every Philippine vegetable.

## Sources

- Categories: Alliance of Bioversity International and CIAT, types of vegetables guide (classification only). https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide
- Which crops are grown and sold: Philippine Statistics Authority, Major Vegetables and Root Crops Quarterly Bulletin. https://psa.gov.ph/content/major-vegetables-and-root-crops-quarterly-bulletin-april-june-2023-0 (cabbage, eggplant, ampalaya, tomato, onion, potato, sweet potato, cassava, mung bean; priority list names snap beans, banana blossom, broccoli, cauliflower, kangkong, lettuce, pechay, string beans, gourd, okra, squash, ginger, pepper, carrots, gabi, radish). The PSA page blocked a direct read, so this list comes from a search summary. Open the page and confirm.
- Filipino names for traditional vegetables: VERA Files, "Bahay Kubo veggies". https://verafiles.org/articles/bahay-kubo-veggies (names only, no scientific names)
- Scientific, English and Filipino names: University of Southeastern Philippines vegetable production module. https://www.academia.edu/35724934/Vegetable_IM2_Classification (blocked on direct read; entries for sayote, kundol, patani and kadyos come from a search summary)
- Still to use: DOST-FNRI Philippine Food Composition Tables, https://i.fnri.dost.gov.ph/fct/library, for Filipino and scientific names.
- Your own wet-market observation visits and the City Agriculturist's Office consultation ([[Problem and Evidence]]) are the best basis for which vegetables to include.

## Migration

`backend/drizzle/20261111090000_vegetable_catalog_more_wet_market/migration.sql` adds 27 vegetables. 16 are approved with a source link. 11 are saved as draft with no checked source (they stay hidden from sellers until reviewed): Petsay Baguio, Alugbati, Talbos ng kamote, Saluyot, Pako, Dahon ng gabi, Kulitis, Dahon ng sili, Talbos ng sayote, Tanglad, Ubod. Not applied to the live database yet.
