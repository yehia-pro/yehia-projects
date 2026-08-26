# Islamic Companion Skill

**Unified tool for prayer times, fasting schedules, and Zakat calculations.**

This skill consolidates Islamic utilities into a single CLI with shared configuration and efficient caching.

## Features

- **Prayer Times:** Retrieve daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha).
- **Fasting:** Check Imsak and Maghrib times for fasting.
- **Zakat:** Calculate Nisab thresholds for Gold and Silver based on current market prices.
- **Quran:** Search for verses by keyword or fetch specific Surah/Ayah with translation.
- **Calendar:** Generate a monthly prayer schedule for any city.
- **Quotes:** Fetch and display random Islamic quotes or setup daily automation.
- **Scheduler:** Generate OpenClaw cron commands to schedule daily prayer reminders.
- **Caching:** Minimizes API calls by caching daily results locally.

## Usage

Run the CLI using the bash script:

```bash
# Get today's prayer times (provide latitude and longitude and optional timezone)
./bin/islamic-companion prayer --today --lat -6.2088 --long 106.8456 --tz Asia/Jakarta

# Setup daily quote automation for specific location
./bin/islamic-companion prayer --sync --lat -6.2088 --long 106.8456 --timezone Asia/Jakarta

# Get a random quote
./bin/islamic-companion quotes --random

# Get monthly calendar (Example: Serang, Banten)
./bin/islamic-companion calendar --city "Serang" --month 2 --year 2026

# Sync prayer schedule to cron (generates commands)
./bin/islamic-companion prayer --sync

# Check fasting times (Imsak/Maghrib)
./bin/islamic-companion fasting --today

# Check Zakat Nisab values
./bin/islamic-companion zakat --nisab

# Search Quran for keyword
./bin/islamic-companion quran --search "sabar"

# Get specific Surah (e.g., Al-Fatihah)
./bin/islamic-companion quran --surah 1

# Get specific Ayah (e.g., Al-Baqarah:255)
./bin/islamic-companion quran --surah 2 --ayah 255
```

## Configuration

Edit `config.json` to set your calculation method and Zakat preferences. Location is now provided on-the-fly via CLI arguments. The system defaults to **UTC** if no timezone is specified.

```json
{
  "calculation": {
    "method": 20,
    "school": 0
  },
  "zakat": {
    "currency": "IDR",
    "gold_gram_threshold": 85,
    "api_key": ""
  },
  "timezone": "Asia/Jakarta",
  "quran_language": "id"
}
```

### Calculation Methods
- **Method 20:** Kemenag RI (Indonesia)
- **School 0:** Standard (Shafi, Maliki, Hanbali)
- **School 1:** Hanafi

## Dependencies

- `bash`
- `curl`
- `jq` (Recommended for best performance, but limited fallback available)
