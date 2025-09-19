// Copyright (c) 2020, Nigerian Army and contributors
// For license information, please see license.txt

frappe.ui.form.on('Army Recruit', {
	refresh: function(frm) {
		frm.add_custom_button('Add Dossier Entry', () => {
            frappe.new_doc('Recruit Dossier Entry', {
                recruit: frm.doc.name
            })
        })
        frm.add_custom_button('Enter Parade State', () => {
            frappe.new_doc('Recruit Parade State', {
                recruit: frm.doc.name
            })
		})
		if( frm.doc.parade_state != 'Hospital Admission'){
			frm.add_custom_button('Report Sick', () => {
				frappe.new_doc('Recruit Sick Report', {
					recruit: frm.doc.name
				})
			})
		}
		if( frm.doc.parade_state != 'Dismissed'){
			frm.add_custom_button('Dismiss Recruit', () => {
				frappe.new_doc('Recruit Dismissal', {
					recruit: frm.doc.name
				})
			})
		}
	}
});
