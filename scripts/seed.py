"""
Seed real sample data from JioSaavn for SSPLAY (Offline Setup)
Run from project root: python scripts/seed.py
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "server"))

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "server", ".env"))

from app.database import connect_db, close_db
from app.models.user import User
from app.models.artist import Artist
from app.models.album import Album
from app.models.song import Song
from app.models.playlist import Playlist
from app.utils.security import hash_password

# Structured list of 100 popular Indian tracks
SEEDED_TRACKS = [
    # --- BOLLYWOOD HITS ---
    {"title": "Kesariya", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 268},
    {"title": "Tum Hi Ho", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 262},
    {"title": "Apna Bana Le", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 264},
    {"title": "Chaleya", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 200},
    {"title": "Kabira", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 223},
    {"title": "Hawayein", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 289},
    {"title": "Channa Mereya", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 289},
    {"title": "Ae Dil Hai Mushkil", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 269},
    {"title": "Galti Se Mistake", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 1", "genre": "Bollywood", "duration": 202},
    {"title": "Tum Kya Mile", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 277},
    {"title": "Zaalima", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 299},
    {"title": "Agar Tum Saath Ho", "artist": "Alka Yagnik", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 341},
    {"title": "Janam Janam", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 238},
    {"title": "Mast Magan", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 280},
    {"title": "Soch Na Sake", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 284},
    {"title": "Gerua", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 345},
    {"title": "Muskurane", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 334},
    {"title": "Samjhawan", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 265},
    {"title": "Suno Na Sangemarmar", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 201},
    {"title": "Naina", "artist": "Arijit Singh", "album": "Bollywood Hits Vol. 2", "genre": "Bollywood", "duration": 287},

    # --- PUNJABI BEATS ---
    {"title": "Brown Munde", "artist": "AP Dhillon", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 267},
    {"title": "Mi Amor", "artist": "Sharn", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 210},
    {"title": "Excuses", "artist": "AP Dhillon", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 176},
    {"title": "295", "artist": "Sidhu Moose Wala", "album": "Moosetape", "genre": "Punjabi", "duration": 270},
    {"title": "The Last Ride", "artist": "Sidhu Moose Wala", "album": "Moosetape", "genre": "Punjabi", "duration": 252},
    {"title": "Legend", "artist": "Sidhu Moose Wala", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 185},
    {"title": "Levels", "artist": "Sidhu Moose Wala", "album": "Moosetape", "genre": "Punjabi", "duration": 232},
    {"title": "Same Beef", "artist": "Sidhu Moose Wala", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 254},
    {"title": "So High", "artist": "Sidhu Moose Wala", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 233},
    {"title": "Old Skool", "artist": "Sidhu Moose Wala", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 263},
    {"title": "G-Shit", "artist": "Sidhu Moose Wala", "album": "Moosetape", "genre": "Punjabi", "duration": 220},
    {"title": "Lover", "artist": "Diljit Dosanjh", "album": "MoonChild Era", "genre": "Punjabi", "duration": 191},
    {"title": "Proper Patola", "artist": "Diljit Dosanjh", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 180},
    {"title": "Lemonade", "artist": "Diljit Dosanjh", "album": "MoonChild Era", "genre": "Punjabi", "duration": 174},
    {"title": "G.O.A.T.", "artist": "Diljit Dosanjh", "album": "G.O.A.T.", "genre": "Punjabi", "duration": 223},
    {"title": "Born to Shine", "artist": "Diljit Dosanjh", "album": "G.O.A.T.", "genre": "Punjabi", "duration": 213},
    {"title": "Do You Know", "artist": "Diljit Dosanjh", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 220},
    {"title": "Peaches", "artist": "Diljit Dosanjh", "album": "MoonChild Era", "genre": "Punjabi", "duration": 194},
    {"title": "Pasoori", "artist": "Ali Sethi", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 224},
    {"title": "Bijlee Bijlee", "artist": "Harrdy Sandhu", "album": "Punjabi Hits Vol. 1", "genre": "Punjabi", "duration": 188},

    # --- TOLLYWOOD & SOUTH ---
    {"title": "Naatu Naatu", "artist": "Rahul Sipligunj", "album": "RRR", "genre": "Tollywood", "duration": 215},
    {"title": "Arabic Kuthu", "artist": "Anirudh Ravichander", "album": "Beast", "genre": "Tollywood", "duration": 280},
    {"title": "Ranjithame", "artist": "Vijay", "album": "Varisu", "genre": "Tollywood", "duration": 288},
    {"title": "Hukum", "artist": "Anirudh Ravichander", "album": "Jailer", "genre": "Tollywood", "duration": 207},
    {"title": "Badass", "artist": "Anirudh Ravichander", "album": "Leo", "genre": "Tollywood", "duration": 229},
    {"title": "Oo Antava Oo Oo Antava", "artist": "Indravathi Chauhan", "album": "Pushpa", "genre": "Tollywood", "duration": 223},
    {"title": "Srivalli", "artist": "Sid Sriram", "album": "Pushpa", "genre": "Tollywood", "duration": 224},
    {"title": "Saami Saami", "artist": "Mounika Yadav", "album": "Pushpa", "genre": "Tollywood", "duration": 227},
    {"title": "Butta Bomma", "artist": "Armaan Malik", "album": "Ala Vaikunthapurramuloo", "genre": "Tollywood", "duration": 209},
    {"title": "Ramuloo Ramulaa", "artist": "Anurag Kulkarni", "album": "Ala Vaikunthapurramuloo", "genre": "Tollywood", "duration": 253},
    {"title": "Inkem Inkem Inkem Kaavaale", "artist": "Sid Sriram", "album": "Geetha Govindam", "genre": "Tollywood", "duration": 267},
    {"title": "Kadavule Pole", "artist": "Sid Sriram", "album": "South Hits Vol. 1", "genre": "Tollywood", "duration": 204},
    {"title": "Top Tucker", "artist": "Badshah", "album": "South Hits Vol. 1", "genre": "Tollywood", "duration": 175},
    {"title": "Rowdy Baby", "artist": "Dhanush", "album": "Maari 2", "genre": "Tollywood", "duration": 284},
    {"title": "Enjoy Enjaami", "artist": "Dhee", "album": "South Hits Vol. 1", "genre": "Tollywood", "duration": 252},
    {"title": "Tum Tum", "artist": "Sri Vardhini", "album": "South Hits Vol. 1", "genre": "Tollywood", "duration": 218},
    {"title": "Chella Kutti", "artist": "Vijay", "album": "Theri", "genre": "Tollywood", "duration": 257},
    {"title": "Thee Thalapathy", "artist": "Silambarasan TR", "album": "Varisu", "genre": "Tollywood", "duration": 250},
    {"title": "Vaathi Coming", "artist": "Anirudh Ravichander", "album": "Master", "genre": "Tollywood", "duration": 230},
    {"title": "Kutti Story", "artist": "Vijay", "album": "Master", "genre": "Tollywood", "duration": 321},

    # --- ROMANTIC SPECIAL ---
    {"title": "Raataan Lambiyan", "artist": "Jubin Nautiyal", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 230},
    {"title": "Ranjha", "artist": "B Praak", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 228},
    {"title": "Dil Diyan Gallan", "artist": "Atif Aslam", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 260},
    {"title": "Kaun Tujhe", "artist": "Palak Muchhal", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 241},
    {"title": "Dil Ko Karaar Aaya", "artist": "Yasser Desai", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 273},
    {"title": "Tera Ban Jaunga", "artist": "Akhil Sachdeva", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 197},
    {"title": "Tujhe Kitna Chahne Lage", "artist": "Arijit Singh", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 284},
    {"title": "Bekhayali", "artist": "Sachet Tandon", "album": "Romantic Hits Vol. 1", "genre": "Romantic", "duration": 371},
    {"title": "Mere Yaara", "artist": "Arijit Singh", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 286},
    {"title": "Humsafar", "artist": "Akhil Sachdeva", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 268},
    {"title": "Nazm Nazm", "artist": "Arko", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 227},
    {"title": "Ban Ja Rani", "artist": "Guru Randhawa", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 204},
    {"title": "Pal", "artist": "Arijit Singh", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 242},
    {"title": "Dariya", "artist": "Arko", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 254},
    {"title": "Main Hoon Hero Tera", "artist": "Armaan Malik", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 284},
    {"title": "Bol Do Na Zara", "artist": "Armaan Malik", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 293},
    {"title": "Sab Tera", "artist": "Armaan Malik", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 228},
    {"title": "Sun Saathiya", "artist": "Priya Saraiya", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 220},
    {"title": "Jeena Jeena", "artist": "Atif Aslam", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 229},
    {"title": "Pee Loon", "artist": "Mohit Chauhan", "album": "Romantic Hits Vol. 2", "genre": "Romantic", "duration": 287},

    # --- INDIE & LOFI ---
    {"title": "Baarishein", "artist": "Anuv Jain", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 207},
    {"title": "Alag Aasmaan", "artist": "Anuv Jain", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 212},
    {"title": "Gul", "artist": "Anuv Jain", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 215},
    {"title": "Mishri", "artist": "Anuv Jain", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 218},
    {"title": "Husn", "artist": "Anuv Jain", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 217},
    {"title": "Choo Lo", "artist": "The Local Train", "album": "Aalas Ka Pedh", "genre": "Indie", "duration": 233},
    {"title": "Dil Mere", "artist": "The Local Train", "album": "Aalas Ka Pedh", "genre": "Indie", "duration": 209},
    {"title": "Aaftab", "artist": "The Local Train", "album": "Aalas Ka Pedh", "genre": "Indie", "duration": 221},
    {"title": "Khudi", "artist": "The Local Train", "album": "Viraasat", "genre": "Indie", "duration": 295},
    {"title": "Kasoor", "artist": "Prateek Kuhad", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 197},
    {"title": "cold/mess", "artist": "Prateek Kuhad", "album": "cold/mess", "genre": "Indie", "duration": 246},
    {"title": "Tum Jab Paas", "artist": "Prateek Kuhad", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 172},
    {"title": "kho gaye hum kahan", "artist": "Prateek Kuhad", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 234},
    {"title": "Liggi", "artist": "Ritviz", "album": "Dev", "genre": "Indie", "duration": 182},
    {"title": "Sage", "artist": "Ritviz", "album": "Dev", "genre": "Indie", "duration": 206},
    {"title": "Udd Gaye", "artist": "Ritviz", "album": "Dev", "genre": "Indie", "duration": 180},
    {"title": "Jeet", "artist": "Ritviz", "album": "Dev", "genre": "Indie", "duration": 224},
    {"title": "Wishes", "artist": "Hasan Raheem", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 182},
    {"title": "Jo Tum Mere Ho", "artist": "Anuv Jain", "album": "Indie Hits Vol. 1", "genre": "Indie", "duration": 205},
    {"title": "Tu Aake Dekhle", "artist": "King", "album": "The Carnival", "genre": "Indie", "duration": 270},
]


async def seed():
    print("Connecting to MongoDB Atlas...")
    await connect_db()

    print("Cleaning database...")
    for model in [User, Artist, Album, Song, Playlist]:
        await model.get_pymongo_collection().delete_many({})

    # Seed users
    admin = User(
        name="SSPLAY Admin",
        email="admin@ssplay.app",
        password=hash_password("admin123456"),
        role="admin",
        is_premium=True,
        is_verified=True,
    )
    await admin.insert()

    demo = User(
        name="Demo Listener",
        email="demo@ssplay.app",
        password=hash_password("demo123456"),
        is_premium=True,
    )
    demo.preferences.genres = ["Bollywood", "Punjabi", "Tollywood", "Romantic", "Indie"]
    await demo.insert()

    all_song_ids = []
    seeded_count = 0

    print("Seeding 100 official Indian music documents...")
    for i, t in enumerate(SEEDED_TRACKS):
        try:
            # 1. Artist Setup
            artist_name = t["artist"]
            artist = await Artist.find_one(Artist.name == artist_name)
            if not artist:
                # Unique random but stable picsum image based on name hash
                name_slug = artist_name.lower().replace(" ", "")
                artist = Artist(
                    name=artist_name,
                    bio=f"Official SSPLAY verified page for {artist_name}.",
                    image=f"https://picsum.photos/seed/{name_slug}/400/400",
                    banner="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200",
                    genres=[t["genre"]],
                    verified=True,
                    monthly_listeners=4_500_000 + (i * 25000),
                )
                await artist.insert()

            # 2. Album Setup
            album_title = t["album"]
            album = await Album.find_one(Album.title == album_title, Album.artist.id == artist.id)
            if not album:
                album_slug = album_title.lower().replace(" ", "")
                album = Album(
                    title=album_title,
                    artist=artist,
                    cover_art=f"https://picsum.photos/seed/{album_slug}/400/400",
                    genre=t["genre"],
                    songs=[],
                )
                await album.insert()

            # 3. Song Setup
            # We seed with source = "jiosaavn" and empty external_ids (the title-based search fallback will auto-resolve)
            song = Song(
                title=t["title"],
                artist=artist,
                album=str(album.id),
                duration=t["duration"],
                genre=t["genre"],
                cover_art=album.cover_art,
                audio_url="",  # Left blank; will dynamically fetch 320kbps original audio on click!
                status="approved",
                source="jiosaavn",
                external_ids={},  # Triggers dynamic search resolution by "{Title} {Artist}"
            )
            await song.insert()

            # Link Song to Album
            album.songs.append(str(song.id))
            await album.save()

            all_song_ids.append(str(song.id))
            seeded_count += 1
        except Exception as err:
            print(f"Error seeding track {t['title']}: {err}")

    # Seed default playlist
    if all_song_ids:
        playlist = Playlist(
            name="SSPLAY Indian Hits Essentials",
            description="Premium cinematic compilation of seeded Indian hits.",
            owner=str(demo.id),
            songs=all_song_ids[:20],
            cover_art=f"https://picsum.photos/seed/essentialsplaylist/400/400",
            is_public=True,
        )
        await playlist.insert()

    await close_db()
    print(f"\nSeed complete! Successfully inserted {seeded_count} official Indian tracks offline.")
    print("All songs will resolve their original high-quality audio files dynamically upon playback!")
    print("Admin: admin@ssplay.app / admin123456")
    print("Demo:  demo@ssplay.app / demo123456")


if __name__ == "__main__":
    asyncio.run(seed())
