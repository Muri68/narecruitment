import frappe
import datetime
from frappe.utils import get_url

def get_context(context):
    try:
        sql = ''
        context.error = 'None'
        if ('state' in frappe.form_dict):
            context.state = frappe.form_dict['state']
            context.view = 'state'
            sql = "SELECT name, surname, other_names, first_name, state FROM `tabRecruitment Application` WHERE `state`='"+context.state+"' AND `recruitment_status`='Shortlisted' AND `Intake` = '89RRI'"
        else:
            context.view = 'list'
            sql = "SELECT `state`, COUNT(name) as count FROM `tabRecruitment Application` GROUP BY `state`"
        
        context.sql = sql

        context.result= frappe.db.sql(sql, as_dict=True)
        if not context.result:
            context.result = False
        context.dict = frappe.form_dict['state']
    except Exception as e:
        context.error = e