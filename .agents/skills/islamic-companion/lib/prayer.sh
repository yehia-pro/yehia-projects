#!/bin/bash

# Prayer Times Module

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"
source "${SCRIPT_DIR}/cache.sh"
source "${SCRIPT_DIR}/api.sh"
source "${SCRIPT_DIR}/format.sh"

# Get Prayer Times
# Usage: get_prayer_times lat long [timezone]
get_prayer_times() {
    local lat="$1"
    local long="$2"
    local tz="${3:-$TIMEZONE}"
    
    if [ -z "$lat" ] || [ -z "$long" ]; then
        echo "Error: Latitude and longitude are required." >&2
        return 1
    fi
    
    load_config
    
    # Get today's date
    local today=$(date "+%d-%m-%Y")
    local cache_key="timings_${lat}_${long}_${today}_${tz//\//_}"
    
    # Check cache
    if cache_exists "$cache_key"; then
        cache_read "$cache_key"
        return 0
    fi
    
    # Fetch from API
    local url="https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${long}&method=${CALCULATION_METHOD}&school=${CALCULATION_SCHOOL}"
    
    if [ ! -z "$tz" ]; then
        url="${url}&timezonestring=$(url_encode "$tz")"
    fi
    
    local response=$(api_call "$url")
    if [ $? -eq 0 ] && [ ! -z "$response" ]; then
        cache_write "$cache_key" "$response"
        echo "$response"
    else
        return 1
    fi
}

# Handle Prayer Command
# Usage: handle_prayer [args...]
handle_prayer() {
    local show_today=false
    local do_sync=false
    local lat=""
    local long=""
    local tz=""
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --today) show_today=true; shift ;;
            --sync) do_sync=true; shift ;;
            --lat) lat="$2"; shift 2 ;;
            --long|--lon) long="$2"; shift 2 ;;
            --timezone|--tz) tz="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ "$do_sync" = true ]; then
        source "${SCRIPT_DIR}/scheduler.sh"
        handle_sync "$lat" "$long" "$tz"
        return
    fi
    
    if [ "$show_today" = true ]; then
        local data=$(get_prayer_times "$lat" "$long" "$tz")
        if [ $? -ne 0 ]; then
            echo "Could not retrieve prayer times."
            return 1
        fi
        
        local date_readable=$(json_get "$data" "data.date.readable")
        local fajr=$(json_get "$data" "data.timings.Fajr")
        local dhuhr=$(json_get "$data" "data.timings.Dhuhr")
        local asr=$(json_get "$data" "data.timings.Asr")
        local maghrib=$(json_get "$data" "data.timings.Maghrib")
        local isha=$(json_get "$data" "data.timings.Isha")
        local timezone=$(json_get "$data" "data.meta.timezone")
        
        print_header "Prayer Times for $date_readable"
        print_kv "Timezone" "$timezone"
        print_kv "Fajr" "$fajr"
        print_kv "Dhuhr" "$dhuhr"
        print_kv "Asr" "$asr"
        print_kv "Maghrib" "$maghrib"
        print_kv "Isha" "$isha"
        echo ""
    else
        echo "Usage: prayer --today | --sync"
    fi
}
