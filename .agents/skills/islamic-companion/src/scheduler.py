import json
import sys
from datetime import datetime, timedelta
from api import get_prayer_times, load_config

def handle_sync_command(args):
    data = get_prayer_times(latitude=args.lat, longitude=args.long, timezone=getattr(args, 'timezone', None))
    if not data or 'data' not in data:
        print("Sync failed: No data.")
        return

    timings = data['data']['timings']
    # Filter only required keys
    prayers = {k: timings[k] for k in ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']}
    
    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")
    
    # We output instructions for the user/agent on what to schedule.
    # In a real automated environment, the agent would parse this or we'd use a tool directly.
    # The plan says to print CRON_ADD lines.
    
    for name, time_str in prayers.items():
        # Clean time string (remove (WIB) etc if present)
        time_str = time_str.split(' ')[0]
        
        # Parse time
        try:
            prayer_dt = datetime.strptime(f"{today_str} {time_str}", "%Y-%m-%d %H:%M")
        except ValueError:
            # Handle cases where format might differ
            continue
        
        if prayer_dt > now:
            # Create a one-off job for today with CLI syntax
            # Assuming +07:00 for simplicity or need to fetch offset
            iso_time = prayer_dt.isoformat()
            if '+' not in iso_time and 'Z' not in iso_time:
                 iso_time += "+07:00"

            job_name = f"prayer-{name.lower()}-{today_str}"
            message = f"It is time for {name} prayer."
            
            print(f'Please add a cron job named "{job_name}" at "{iso_time}" that announces: "{message}"')
            
    print("SECURITY NOTICE: The following CRON_ADD lines will schedule jobs.")
    print("Please review the commands below before allowing them to run, as they will execute code on this machine.")
    print("Sync complete. Parse lines starting with CRON_ADD to schedule.")
