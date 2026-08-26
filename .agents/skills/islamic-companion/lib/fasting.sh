#!/bin/bash

# Fasting Times Module

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/prayer.sh"

# Handle Fasting Command
handle_fasting() {
    local show_today=false
    local tz=""
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --today) show_today=true; shift ;;
            --lat) lat="$2"; shift 2 ;;
            --long|--lon) long="$2"; shift 2 ;;
            --timezone|--tz) tz="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ "$show_today" = true ]; then
        local data=$(get_prayer_times "$lat" "$long" "$tz")
        if [ $? -ne 0 ]; then
            echo "Could not retrieve fasting times."
            return 1
        fi
        
        local date_readable=$(json_get "$data" "data.date.readable")
        local imsak=$(json_get "$data" "data.timings.Imsak")
        local maghrib=$(json_get "$data" "data.timings.Maghrib")
        local timezone=$(json_get "$data" "data.meta.timezone")
        
        print_header "Fasting Schedule for $date_readable"
        print_kv "Timezone" "$timezone"
        print_kv "Imsak (Stop Eating)" "$imsak"
        print_kv "Maghrib (Break Fast)" "$maghrib"
        echo ""
    else
        echo "Usage: fasting --today"
    fi
}
