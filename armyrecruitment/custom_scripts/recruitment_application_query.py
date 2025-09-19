import frappe


def recruitment_application_query(user): 
    if not user: 
        user = frappe.session.user
    if "System Manager" in frappe.get_roles(user):
        return ""
    
    # SRO role gets state-based access
    if "SRO" in frappe.get_roles(user):
        user_doc = frappe.get_doc("User", user)
        if user_doc.get("state"):
            return f"`tabRecruitment Application`.state = '{user_doc.state}'"

    # Default return for other roles
    return ""