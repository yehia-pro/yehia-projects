from api import get_random_quote
import json

def handle_quotes_command(args):
    if args.setup:
        # Output prompt for the agent
        print('Please add a cron job named "islamic-companion-daily-quote" running daily at 08:00 AM (Asia/Jakarta) that announces: "Give me my daily Islamic quote from the islamic-companion skill."')
        print("\nDaily quote automation prompt generated.")
        return

    # Normal fetch and display
    data = get_random_quote()
    if not data or 'data' not in data:
        print("Could not retrieve a quote at this time.")
        return

    quote_data = data['data']
    text = quote_data.get('text', '')
    author = quote_data.get('author', {}).get('name', 'Unknown')
    reference = quote_data.get('reference', '')

    print(f"\n\"{text}\"")
    print(f"— {author} {f'({reference})' if reference else ''}\n")
