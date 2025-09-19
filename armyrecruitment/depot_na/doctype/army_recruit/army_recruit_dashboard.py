from __future__ import unicode_literals
from frappe import _

def get_data():
    return {
        'fieldname': 'recruit',
		'transactions': [
			{
				'label': _('Administration'),
				'items': ['Recruit Dossier Entry', 'Recruit Sick Report', 'Recruit Parade State']
			}
		]

    }