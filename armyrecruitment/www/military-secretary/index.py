import frappe
import datetime

def get_context(context):
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    recruitment_settings = frappe.get_single("Recruitment Setting")
    year = datetime.datetime.now().year
    
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
    context.publish_list = recruitment_settings.publish_officers_list
    context.active_application = recruitment_settings.active_application
    context.publish_type = recruitment_settings.publish_shortlist_type
    context.application_end_instruction = recruitment_settings.application_closed_description
    
    context.is_recruitment_active = frappe.db.get_value("DSSC SSC Application Course", 
            filters={"from": ["<=", current_date], "to": [">=", current_date]},
            fieldname=['name', 'course_name', 'from', 'to', 'type_of_commission', 'introduction', 'entry_requirements', 'conditions_of_service', 'method_of_application'], # Add fields you need
            as_dict=True
        )
    
    if(context.is_recruitment_active and context.is_recruitment_active.type_of_commission == "DSSC"):
        context.app_url = f'/military-secretary/dssc-application-form'
        context.user_application = frappe.get_all(
            "DSSC Application",
            fields = ["name","recruitment_status"],
            filters={
                "owner": frappe.session.user,
                "creation": ["between", [f"{year}-01-01", f"{year}-12-31"]]
            },
        )
        if context.user_application and context.is_recruitment_active and context.user_application[0].recruitment_status == "Submitted":
            context.printUrl = f'/military-secretary/dssc-application-form'
        else: 
            context.printUrl = False
        
    if(context.is_recruitment_active and context.is_recruitment_active.type_of_commission == "SSC"):
        context.app_url = f'/military-secretary/ssc-application-form'
        context.user_application = frappe.get_all(
            "SSC Application",
            fields = ["name","recruitment_status"],
            filters={
                "owner": frappe.session.user,
                "creation": ["between", [f"{year}-01-01", f"{year}-12-31"]]
                
            },
        )
        if context.user_application and context.is_recruitment_active and context.user_application[0].recruitment_status == "Submitted":
            context.printUrl = f'/military-secretary/ssc-application-form'
        else: 
            context.printUrl = False

    if(context.is_recruitment_active):
        context.application_ongoing = f'{context.is_recruitment_active.name} Online Application is ongoing.'
        context.ms_applications  = True
        context.course_name = context.is_recruitment_active.course_name 
        context.name = context.is_recruitment_active.name
    else:
        context.application_ongoing = "NO ongoing recruitment application."
        context.ms_applications  = False  
        context.course_name = "Officers Commission"  
        context.name = "SSC / DSSC"  
    return context