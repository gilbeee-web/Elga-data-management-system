<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductTemplateExport implements FromArray, WithHeadings
{
    public function headings(): array
    {
        return [
            'Product name',
            'Variant name',
            'Product code',
            'Price',
            'Category'
        ];
    }

    public function array(): array
    {
        return [
            [
                'Example Product',
                'BLACK',
                'EXAMPLE-BLACK',
                '0.00',
                'Bag'
            ],
            [
                'Example Product',
                'BLUE',
                'EXAMPLE-BLUE',
                '0.00',
                'Clothes'
            ],
        ];
    }
}