import frappe
import datetime
from frappe.utils import get_url

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
    context.application_end_instruction = recruitment_settings.application_end_instruction
    context.show_banner = recruitment_settings.show_banner
    context.home_header = recruitment_settings.home_header
    context.publish_list = recruitment_settings.publish_list
    context.current_year = frappe.utils.today().split('-')[0]

   # Replace direct SQL query with ORM
    context.user_application = frappe.get_all(
        "Recruitment Application",
        fields = ["name","recruitment_status"],
        filters={
            "owner": frappe.session.user,
            "creation": ["between", [f"{year}-01-01", f"{year}-12-31"]]
        },
        # as_dict=True
    )
    context.is_recruitment_active = frappe.db.exists("Regular Intake Application",{"from": ["<=", current_date],"to": [">=", current_date]})
    context.current_recruitment = frappe.get_all(
        "Regular Intake Application",
        fields = ["name","from","to","method_of_application","benefit_of_service","basic_requirements","general_instructions"],
        filters={
            "from": ["<=", current_date],
            "to": [">=", current_date]
        },
        # as_dict=True
    )

    # Simplified null check
    if context.user_application and context.is_recruitment_active and context.user_application[0].recruitment_status == "Submitted":
        frappe.local.flags.redirect_location = "/drm/recruitment-application-form"
        raise frappe.Redirect
    # else:
    #     context.user_application = None

    if(context.is_recruitment_active):
        context.application_ongoing = f'{context.is_recruitment_active} Online Application is ongoing.'
        context.regular_intake_applications  = True
    else:
        context.application_ongoing = 'NO ongoing recruitment application.'
        context.regular_intake_applications  = False 
        shortlisted_candidates(context, recruitment_settings.active_rri)  
    return context


def shortlisted_candidates(context, rri):
    try:
        sql = ''
        context.error = 'None'
        if ('state' in frappe.form_dict):
            context.state = frappe.form_dict['state']
            context.view = 'state'
            sql = "SELECT `surname`, `first_name`, `other_names`, `name` FROM `tabRecruitment Application` WHERE state='"+ context.state +"' AND recruitment_status = 'Shortlisted' AND intake = '"+ rri +"' ORDER BY `name` ASC"
        else:
            context.view = 'list'
            sql = "SELECT `state`, COUNT(name) as count FROM `tabRecruitment Application` GROUP BY `state`"
        
        # context.sql = sql
        # sql = "SELECT name, surname, other_names, first_name, state FROM `tabRecruitment Application` WHERE `state`='"+context.state+"' AND `recruitment_status`='Shortlisted' AND `Intake` = '"+rri+"'"
        context.result= frappe.db.sql(sql, as_dict=True)
        if not context.result:
            context.result = False
        context.dict = frappe.form_dict['state']
    except Exception as e:
        context.error = e