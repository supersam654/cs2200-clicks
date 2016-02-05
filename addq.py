import time
import pprint
import json

PROMPT = '> '

def get_data(statement, default=None):
    data = ''
    print('%s (%s)' % (statement, default or ''))
    while len(data) == 0:

        data = raw_input(PROMPT)
        if len(data) == 0:
            if default is not None:
                return default
        else:
            return data
        print('Please enter a value.')

def write_to_file(data):
    with open('data.json', 'a') as f:
        line_data = json.dumps(data) + '\n'
        f.write(line_data)

description = get_data('Enter a brief description of the question:')
date = get_data('Enter the date the question was asked (mm/dd/yyyy):', time.strftime('%m/%d/%Y'))
time = get_data('Enter the time the question was asked (hh:mm am/pm):', time.strftime('%I:%M %p'))
responses = get_data('How many responses were recorded?')
comments = get_data('Any additional comments?', 'None')

data = {
    'description': description,
    'date': date,
    'time': time,
    'responses': responses,
    'comments': comments
}

pprint.pprint(data, width=1)
accept = get_data('Does this look correct? [y/n]', 'Y')
if accept[0].lower() == 'y':
    print('Saving to JSON file.')
    write_to_file(data)
else:
    print('Aborting and discarding your hard work.')
