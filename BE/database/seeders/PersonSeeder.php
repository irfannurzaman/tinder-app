<?php

namespace Database\Seeders;

use App\Models\Person;
use App\Models\Picture;
use Illuminate\Database\Seeder;

class PersonSeeder extends Seeder
{
    public function run(): void
    {
        // 5 foto yang tersedia
        $photos = [
            'foto1.png',
            'foto2.png',
            'foto3.png',
            'foto4.png',
            'foto5.png',
        ];

        // Buat 5 user dummy
        $peopleData = [
            ['name' => 'Ayu', 'age' => 24, 'location' => 'Jakarta', 'bio' => 'Suka kopi susu dan jalan-jalan sore.'],
            ['name' => 'Rina', 'age' => 27, 'location' => 'Bandung', 'bio' => 'Pecinta buku dan hiking di akhir pekan.'],
            ['name' => 'Budi', 'age' => 30, 'location' => 'Surabaya', 'bio' => 'Pecinta olahraga dan kopi pagi.'],
            ['name' => 'Dewi', 'age' => 22, 'location' => 'Yogyakarta', 'bio' => 'Senang membaca dan menulis puisi.'],
            ['name' => 'Andi', 'age' => 28, 'location' => 'Medan', 'bio' => 'Gemar traveling dan fotografi.'],
        ];

        foreach ($peopleData as $index => $personData) {
            $person = Person::create([
                'name' => $personData['name'],
                'age' => $personData['age'],
                'location' => $personData['location'],
                'latitude' => rand(-9000, 9000)/1000, // latitude acak untuk contoh
                'longitude' => rand(9000, 12000)/1000, // longitude acak untuk contoh
                'bio' => $personData['bio'],
            ]);

            // Ambil 1 foto acak dari array untuk tiap user
            $photo = $photos[$index % count($photos)];

            Picture::create([
                'people_id' => $person->id,
                'url' => "http://192.168.1.17:8000/assets/$photo",
                'order' => 0,
            ]);
        }
    }
}
