#!/bin/bash

# Quotes Module

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"
source "${SCRIPT_DIR}/api.sh"
source "${SCRIPT_DIR}/cache.sh"
source "${SCRIPT_DIR}/format.sh"

# Get Quote Count
get_quote_count() {
    # Try to fetch metadata
    local url="https://ilm.islamic.network/items/quotes?limit=1&meta=filter_count"
    local response=$(curl -s "$url")
    
    if [ -z "$response" ]; then
        echo "84" # Fallback
        return
    fi
    
    local count=$(json_get "$response" "meta.filter_count")
    if [ -z "$count" ] || [ "$count" = "null" ]; then
        echo "84"
    else
        echo "$count"
    fi
}

# Get Random Quote
get_random_quote() {
    local max_count=$(get_quote_count)
    
    # Generate random ID
    local random_id=$(( (RANDOM % max_count) + 1 ))
    
    local url="https://ilm.islamic.network/items/quotes/${random_id}?fields=text,reference,translations.*,author.name"
    
    # Do not cache random quotes strictly, or maybe cache by ID if we want
    # But usually random means fetch fresh
    
    local response=$(api_call "$url")
    echo "$response"
}

# Handle Quotes Command
# Usage: handle_quotes [args...]
handle_quotes() {
    local do_setup=false
    local do_random=false
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --setup) do_setup=true; shift ;;
            --random) do_random=true; shift ;;
            *) shift ;;
        esac
    done
    
    if [ "$do_setup" = true ]; then
        # Output prompt as requested
        echo "Please add a cron job named \"islamic-companion-daily-quote\" running daily at 08:00 AM (Asia/Jakarta) that announces: \"Give me my daily Islamic quote from the islamic-companion skill.\""
        
        echo -e "\nDaily quote automation prompt generated."
        return
    fi
    
    if [ "$do_random" = true ]; then
        local data=$(get_random_quote)
        if [ -z "$data" ]; then
            echo "Could not retrieve a quote at this time."
            return 1
        fi
        
        local text=$(json_get "$data" "data.text")
        local author=$(json_get "$data" "data.author.name")
        local reference=$(json_get "$data" "data.reference")
        
        if [ -z "$author" ] || [ "$author" = "null" ]; then author="Unknown"; fi
        
        echo -e "\n\"${text}\""
        if [ ! -z "$reference" ] && [ "$reference" != "null" ]; then
            echo -e "— ${author} (${reference})\n"
        else
            echo -e "— ${author}\n"
        fi
    else
        echo "Usage: quotes --random | --setup"
    fi
}
