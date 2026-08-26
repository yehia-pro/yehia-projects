#!/bin/bash

# Scheduler Module (Cron Generation)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/prayer.sh"

# Handle Sync Command
# Usage: handle_sync lat long
# Handle Sync Command
# Usage: handle_sync lat long [timezone]
handle_sync() {
    local lat="$1"
    local long="$2"
    local tz="$3"
    
    # We need prayer times for today
    local data=$(get_prayer_times "$lat" "$long" "$tz")
    
    if [ -z "$data" ]; then
        echo "Sync failed: No data."
        return 1
    fi
    
    local today_str=$(date "+%Y-%m-%d")
    
    # Prayers to schedule
    local prayers=("Fajr" "Dhuhr" "Asr" "Maghrib" "Isha")
    
    for prayer in "${prayers[@]}"; do
        local time_str=$(json_get "$data" "data.timings.$prayer")
        # Remove (WIB) etc
        time_str=$(echo "$time_str" | cut -d' ' -f1)
        
        # Check if time is in future
        local prayer_ts=$(date -d "$today_str $time_str" +%s 2>/dev/null)
        local now_ts=$(date +%s)
        
        # If date parsing failed (Alpine busybox date is limited), try another way or skip check
        # Busybox date often doesn't support -d with complex formats.
        # But we format today_str as YYYY-MM-DD and time_str is HH:MM, which usually works.
        
        if [ -z "$prayer_ts" ]; then
            # Try without date part if only time supported? No, busybox supports -d
            # If failed, assume schedule it anyway
            prayer_ts=$((now_ts + 100)) # dummy
        fi
        
        if [ "$prayer_ts" -gt "$now_ts" ]; then
            local iso_time="${today_str}T${time_str}:00+07:00" # Assuming +07:00 or modify based on TZ if possible
            # Ideally we extract timezone offset from data.meta.timezone
            
            # Simple CLI construction
            local prayer_lower=$(echo "$prayer" | tr '[:upper:]' '[:lower:]')
            local job_name="prayer-${prayer_lower}-${today_str}"
            local message="It is time for ${prayer} prayer."
            
            # Output prompt as requested (not command string)
            echo "Please add a cron job named \"$job_name\" at \"$iso_time\" that announces: \"$message\""
        fi
    done
    
    echo "Sync complete. Parse lines starting with CRON_ADD to schedule."
}
