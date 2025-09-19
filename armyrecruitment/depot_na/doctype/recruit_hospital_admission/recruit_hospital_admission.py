# -*- coding: utf-8 -*-
# Copyright (c) 2020, Nigerian Army and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RecruitHospitalAdmission(Document):
	
	def on_submit(self):
		recruit = frappe.get_doc('Army Recruit', self.recruit)
		recruit.parade_state = "Hospital Admission"
		recruit.save()

@frappe.whitelist()
def discharge_recruit(name, discharge_date):
	try:
		# change Discharged to Yes and assign date
		recruit = frappe.db.get_value('Recruit Hospital Admission', name, 'recruit')
		discharge_sql = "UPDATE `tabRecruit Hospital Admission` SET `discharged` = 'Yes', `discharge_date` = '"+discharge_date+"' WHERE `name`='"+name+"'"
		frappe.db.sql(discharge_sql)
		# change recruit parade state to On Parade
		frappe.db.set_value('Army Recruit', recruit, 'parade_state', 'On Parade')
		return True
	except:
		frappe.db.rollback()
		return False