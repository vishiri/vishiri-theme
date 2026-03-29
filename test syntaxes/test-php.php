<?php

/**
 * PHP syntax stress-test for theme tuning.
 *
 * @package TestSyntaxes
 * @see https://www.php.net/manual/en/langref.php
 */

declare(strict_types=1);

namespace TestSyntaxes\Demo;

use ArrayAccess;
use Countable;
use InvalidArgumentException;
use IteratorAggregate;
use JsonSerializable;
use RuntimeException;
use Throwable;

// -----------------------------------------------------------------------------
// Constants, enums (8.1+), attributes
// -----------------------------------------------------------------------------

const APP_VERSION = '1.0.0';

define('LEGACY_CONST', 42);

enum Priority: int {
    case Low = 0;
    case Medium = 1;
    case High = 2;

    public function label(): string {
        return match ($this) {
            self::Low => 'low',
            self::Medium => 'medium',
            self::High => 'high',
        };
    }
}

#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::TARGET_METHOD)]
final class Route {
    public function __construct(
        public string $path,
        public string $method = 'GET',
    ) {
    }
}

// -----------------------------------------------------------------------------
// Readonly / constructor promotion / backed properties
// -----------------------------------------------------------------------------

readonly class Config {
    public function __construct(
        public string $mint,
        public string $gold,
        private array $extra = [],
    ) {
    }

    public function get(string $key, mixed $default = null): mixed {
        return $this->extra[$key] ?? $default;
    }
}

// -----------------------------------------------------------------------------
// Interface, trait, abstract
// -----------------------------------------------------------------------------

interface RepositoryInterface {
    public function find(string $id): ?object;

    public function save(object $entity): void;
}

trait Timestampable {
    protected ?\DateTimeImmutable $createdAt = null;

    protected function touch(): void {
        $this->createdAt = new \DateTimeImmutable('now');
    }
}

abstract class AbstractEntity {
    use Timestampable;

    public function __construct(
        protected string $id,
    ) {
        $this->touch();
    }

    abstract public function toArray(): array;
}

// -----------------------------------------------------------------------------
// Class: union types, intersections, static, final
// -----------------------------------------------------------------------------

/**
 * @template T of object
 * @implements RepositoryInterface
 */
#[Route(path: '/users', method: 'GET')]
final class UserRepository extends AbstractEntity implements RepositoryInterface, JsonSerializable {
    /** @var list<array{id: string, name: string}> */
    private array $rows = [];

    public function __construct(string $id = 'repo') {
        parent::__construct($id);
    }

    public function find(string $id): ?object {
        foreach ($this->rows as $row) {
            if ($row['id'] === $id) {
                return (object) $row;
            }
        }

        return null;
    }

    public function save(object $entity): void {
        if (!isset($entity->id)) {
            throw new InvalidArgumentException('Entity must have id');
        }
        $this->rows[] = ['id' => $entity->id, 'name' => $entity->name ?? ''];
    }

    public function toArray(): array {
        return ['id' => $this->id, 'rows' => $this->rows];
    }

    public function jsonSerialize(): mixed {
        return $this->toArray();
    }

    public static function factory(): self {
        return new self();
    }
}

// -----------------------------------------------------------------------------
// Generators, first-class callable, arrow functions
// -----------------------------------------------------------------------------

/**
 * @return \Generator<int, string>
 */
function lines(): \Generator {
    yield 0 => 'mint';
    yield 1 => 'gold';
    yield from ['crimson', 'cream'];
}

$mul = static fn(int $a, int $b): int => $a * $b;

$strlen = strlen(...);

// -----------------------------------------------------------------------------
// Match, switch, try/catch/finally, nullsafe
// -----------------------------------------------------------------------------

function describe(Priority $p): string {
    return match ($p) {
        Priority::Low => 'L',
        Priority::Medium, Priority::High => 'M+',
    };
}

function legacySwitch(int $n): string {
    switch ($n) {
        case 0:
            return 'zero';
        case 1:
        case 2:
            return 'small';
        default:
            return 'other';
    }
}

function safeCall(?object $o): ?string {
    try {
        return $o?->missing()?->chain();
    } catch (Throwable $e) {
        error_log($e->getMessage());
        return null;
    } finally {
        // cleanup
    }
}

// -----------------------------------------------------------------------------
// Strings: nowdoc, heredoc, interpolation
// -----------------------------------------------------------------------------

$name = 'Vishiri';

$heredoc = <<<HTML
<div class="card">Hello, {$name}</div>
HTML;

$nowdoc = <<<'SQL'
SELECT * FROM users WHERE id = :id;
SQL;

// -----------------------------------------------------------------------------
// Arrays: short syntax, unpacking, spread
// -----------------------------------------------------------------------------

$base = ['a' => 1, 'b' => 2];
$merged = [...$base, 'c' => 3, ...[4, 5]];

// -----------------------------------------------------------------------------
// HTML output (alternative syntax)
// -----------------------------------------------------------------------------

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>PHP embed</title>
</head>

<body>
    <?php if ($mul(2, 3) === 6): ?>
        <p>OK</p>
    <?php elseif (false): ?>
        <p>No</p>
    <?php else: ?>
        <p><?= htmlspecialchars($heredoc, ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>

    <?php foreach ($merged as $k => $v): ?>
        <li><?php echo (string) $k; ?> — <?php var_export($v); ?></li>
    <?php endforeach; ?>
</body>

</html>