from api import get_calendar_by_city
from datetime import datetime

def handle_calendar_command(args):
    now = datetime.now()
    month = args.month or now.month
    year = args.year or now.year
    city = args.city
    country = args.country
    
    # If not provided, raise error
    if not city:
        print("Error: City is required for the calendar command. Use --city.")
        return

    data = get_calendar_by_city(city, country, month, year, timezone=getattr(args, 'timezone', None))
    
    if not data or 'data' not in data:
        print(f"Could not retrieve calendar for {city}, {country}.")
        return

    # Get timezone from the first entry if available
    timezone = "Unknown"
    if data.get('data') and len(data['data']) > 0:
        timezone = data['data'][0].get('meta', {}).get('timezone', 'Unknown')

    print(f"\nPrayer Calendar for {month}/{year} - {city}, {country}")
    print(f"Timezone: {timezone}\n")
    print(f"{'Date':<12} {'Fajr':<8} {'Dhuhr':<8} {'Asr':<8} {'Maghrib':<8} {'Isha':<8}")
    print("-" * 60)
    
    for day in data['data']:
        date_readable = day['date']['gregorian']['date']
        timings = day['timings']
        
        # Clean up time strings (remove timezone suffix if present)
        fajr = timings['Fajr'].split(' ')[0]
        dhuhr = timings['Dhuhr'].split(' ')[0]
        asr = timings['Asr'].split(' ')[0]
        maghrib = timings['Maghrib'].split(' ')[0]
        isha = timings['Isha'].split(' ')[0]
        
        print(f"{date_readable:<12} {fajr:<8} {dhuhr:<8} {asr:<8} {maghrib:<8} {isha:<8}")
