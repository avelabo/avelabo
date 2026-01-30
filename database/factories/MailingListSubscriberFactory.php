<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MailingListSubscriber>
 */
class MailingListSubscriberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'name' => fake()->name(),
            'source' => fake()->randomElement(['website', 'import', 'user_registration']),
            'is_active' => true,
            'subscribed_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'unsubscribed_at' => now(),
        ]);
    }

    public function fromWebsite(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'website',
        ]);
    }

    public function fromImport(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'import',
        ]);
    }

    public function fromUserRegistration(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'user_registration',
        ]);
    }
}
