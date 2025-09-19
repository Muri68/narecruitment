// Copyright (c) 2025, nasirucode and contributors
// For license information, please see license.txt

frappe.ui.form.on("State Recruitment", {
    refresh: function(frm){
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'User',
                name: frappe.session.user
            },
            callback: function(r) {
                if (r.message) {
                    let user = r.message;
                    frm.set_query('application_no', function(doc) {
                        return {
                            filters: {
                                'state': user.state,
                                'recruitment_status': ['in', ['Shortlisted']]
                            }
                        };
                    });
                    // currentPage.set_value('state', user.state);
                    // currentPage.set_df_property("state", "read_only", 1);

                    // currentPage.set_value('mobile_number', user.mobile_no);
                    // currentPage.set_df_property("mobile_number", "read_only", 1);

                }
            }
        });
    },
	
});
