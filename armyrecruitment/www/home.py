import frappe
import datetime

def get_context(context):
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    year = datetime.datetime.now().year
    recruitment_settings = frappe.get_single("Recruitment Setting")
    
    context.notice_content = recruitment_settings.banner_text
    context.notice_buttons = [
        {
            "label": "Start Application",
            "url": "/drm" if recruitment_settings.banner_type == "RRI" else '/military-secretary',
            "primary": True,
            "show": False if recruitment_settings.banner_type == "Announcement" else True
        }
    ]
    context.show_banner = recruitment_settings.show_banner
    context.home_header = recruitment_settings.home_header
    context.current_year = frappe.utils.today().split('-')[0]
    
    is_recruitment_active = frappe.db.exists("Regular Intake Application",{"from": ["<=", current_date],"to": [">=", current_date]})
    if(is_recruitment_active):
        context.application_ongoing = f'{is_recruitment_active} Online Application is ongoing.'
        context.regular_intake_applications  = True
    else:
        context.application_ongoing = "NO ongoing application."
        context.regular_intake_applications  = False

    return context