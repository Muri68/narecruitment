import frappe

def get_context(context):
    context.current_year = frappe.utils.today().split('-')[0]
    context.home_header = "Application"
    return context

@frappe.whitelist()
def get_local_government(state):
    local_governments = frappe.get_all('Local Government', 
        filters={'state': state},
        fields=['name']
    )
    return local_governments

