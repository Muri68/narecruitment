// Copyright (c) 2020, Nigerian Army and contributors
// For license information, please see license.txt

frappe.ui.form.on('Recruit Sick Report', {
	refresh: function(frm) {
		console.log(frm.doc)
		if(frm.doc.docstatus){ // if the doc has been submitted
			frm.add_custom_button('Admit Recruit', () => {
				frappe.new_doc('Recruit Hospital Admission', {
					sick_report: frm.doc.name
				})
			})
		}
	}
});
