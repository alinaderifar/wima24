<?php
namespace App\Enums;

use App\Helpers\Common\Arr;
use Throwable;
use Illuminate\Support\Collection;

/**
 * Trait EnumToArray
 * Adds common helper methods to Enums
 */
trait EnumToArray
{
    /**
     * Get all enum items as array, optionally sorted
     */
    public static function all(string|bool|null $orderBy = null, string $order = 'asc'): array
    {
        $items = collect(self::cases())
            ->mapWithKeys(fn($item) => [$item->value => self::find($item->value)]);

        if ($orderBy !== false) {
            $orderBy = is_string($orderBy) ? $orderBy : 'label';
            try { $items = Arr::mbSortBy($items->toArray(), $orderBy, $order); } catch (Throwable $e) {}
        }

        return $items->toArray();
    }

    /**
     * Find a single enum item
     */
    public static function find(mixed $value = null): array
    {
        if (empty($value)) return [];
        $item = self::tryFrom($value);
        if (!$item) return [];
        $data = [
            'id'    => $item->value,
            'name'  => $item->name,
            'label' => $item->label(),
        ];

        if (method_exists($item, 'title')) {
            $data['title'] = $item->title();
        }

        return $data;
    }

    /**
     * Get all enum names
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * Get all enum values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

/**
 * Enum Gender
 */
enum Gender: int
{
    use EnumToArray;

    case MALE = 1;
    case FEMALE = 2;

    public function label(): string
    {
        return match ($this) {
            self::MALE => trans('enum.male'),
            self::FEMALE => trans('enum.female'),
        };
    }

    public function title(): string
    {
        return match ($this) {
            self::MALE => trans('enum.mr'),
            self::FEMALE => trans('enum.mrs'),
        };
    }
}

/**
 * Enum Continent
 */
enum Continent: string
{
    use EnumToArray;

    case AFRICA = 'AF';
    case ANTARCTICA = 'AN';
    case ASIA = 'AS';
    case EUROPE = 'EU';
    case NORTH_AMERICA = 'NA';
    case OCEANIA = 'OC';
    case SOUTH_AMERICA = 'SA';

    public function label(): string
    {
        return trans('enum.' . strtolower($this->name));
    }
}
