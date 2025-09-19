import frappe

def get_context(context):
    context.current_year = frappe.utils.today().split('-')[0]
    context.home_header = "Application Ongoing"
    return context

@frappe.whitelist()
def get_local_government(state):
    local_governments = frappe.get_all('Local Government', 
        filters={'state': state},
        fields=['name']
    )
    return local_governments
@frappe.whitelist()
def validate(doc):
    # Check if we have the raw image data
    if hasattr(doc, 'passport_photograph_data') and doc.passport_photograph_data:
        # Format it properly for HTML Editor field
        doc.passport_photograph = f'<img src="data:image/jpeg;base64,{doc.passport_photograph_data}" style="max-width: 150px; max-height: 150px;" />'
        # Remove the temporary field
        delattr(doc, 'passport_photograph_data')

