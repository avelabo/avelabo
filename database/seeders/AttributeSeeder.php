<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AttributeSeeder extends Seeder
{
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Color',
                'slug' => 'color',
                'type' => 'color',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 1,
                'values' => [
                    ['value' => 'Black', 'color_code' => '#000000'],
                    ['value' => 'White', 'color_code' => '#FFFFFF'],
                    ['value' => 'Red', 'color_code' => '#FF0000'],
                    ['value' => 'Blue', 'color_code' => '#0000FF'],
                    ['value' => 'Green', 'color_code' => '#008000'],
                    ['value' => 'Yellow', 'color_code' => '#FFFF00'],
                    ['value' => 'Orange', 'color_code' => '#FFA500'],
                    ['value' => 'Purple', 'color_code' => '#800080'],
                    ['value' => 'Pink', 'color_code' => '#FFC0CB'],
                    ['value' => 'Gray', 'color_code' => '#808080'],
                    ['value' => 'Brown', 'color_code' => '#A52A2A'],
                    ['value' => 'Navy', 'color_code' => '#000080'],
                ],
            ],
            [
                'name' => 'Size',
                'slug' => 'size',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 2,
                'values' => [
                    ['value' => 'XS'],
                    ['value' => 'S'],
                    ['value' => 'M'],
                    ['value' => 'L'],
                    ['value' => 'XL'],
                    ['value' => 'XXL'],
                    ['value' => 'XXXL'],
                ],
            ],
            [
                'name' => 'Shoe Size',
                'slug' => 'shoe-size',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 3,
                'values' => [
                    ['value' => '36'],
                    ['value' => '37'],
                    ['value' => '38'],
                    ['value' => '39'],
                    ['value' => '40'],
                    ['value' => '41'],
                    ['value' => '42'],
                    ['value' => '43'],
                    ['value' => '44'],
                    ['value' => '45'],
                    ['value' => '46'],
                ],
            ],
            [
                'name' => 'Storage',
                'slug' => 'storage',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 4,
                'values' => [
                    ['value' => '16GB'],
                    ['value' => '32GB'],
                    ['value' => '64GB'],
                    ['value' => '128GB'],
                    ['value' => '256GB'],
                    ['value' => '512GB'],
                    ['value' => '1TB'],
                    ['value' => '2TB'],
                ],
            ],
            [
                'name' => 'RAM',
                'slug' => 'ram',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 5,
                'values' => [
                    ['value' => '2GB'],
                    ['value' => '4GB'],
                    ['value' => '6GB'],
                    ['value' => '8GB'],
                    ['value' => '12GB'],
                    ['value' => '16GB'],
                    ['value' => '32GB'],
                    ['value' => '64GB'],
                ],
            ],
            [
                'name' => 'Material',
                'slug' => 'material',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 6,
                'values' => [
                    ['value' => 'Cotton'],
                    ['value' => 'Polyester'],
                    ['value' => 'Leather'],
                    ['value' => 'Silk'],
                    ['value' => 'Wool'],
                    ['value' => 'Denim'],
                    ['value' => 'Linen'],
                    ['value' => 'Nylon'],
                ],
            ],
            [
                'name' => 'Brand',
                'slug' => 'brand',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 7,
                'values' => [], // Brands are managed separately
            ],
            [
                'name' => 'Warranty',
                'slug' => 'warranty',
                'type' => 'select',
                'is_filterable' => true,
                'is_visible' => true,
                'sort_order' => 8,
                'values' => [
                    ['value' => 'No Warranty'],
                    ['value' => '6 Months'],
                    ['value' => '1 Year'],
                    ['value' => '2 Years'],
                    ['value' => '3 Years'],
                    ['value' => '5 Years'],
                ],
            ],
        ];

        foreach ($attributes as $attrData) {
            $values = $attrData['values'] ?? [];
            unset($attrData['values']);

            $attribute = Attribute::updateOrCreate(
                ['slug' => $attrData['slug']],
                $attrData
            );

            $valueSortOrder = 1;
            foreach ($values as $valueData) {
                AttributeValue::updateOrCreate(
                    [
                        'attribute_id' => $attribute->id,
                        'slug' => Str::slug($valueData['value']),
                    ],
                    array_merge([
                        'attribute_id' => $attribute->id,
                        'slug' => Str::slug($valueData['value']),
                        'sort_order' => $valueSortOrder++,
                    ], $valueData)
                );
            }
        }
    }
}
