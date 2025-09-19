// Copyright (c) 2024, Nasirucode and contributors
// For license information, please see license.txt

frappe.ui.form.on("Recruitment Application", {
	refresh: function(frm) {
        frm.set_query('local_government', function(doc) {
            return {
                filters: {
                    'state': doc.state
                }
            };
        });
        // frm.set_value('email_address', frappe.session.user);
        frm.set_df_property("declaration", "reqd", 1);

        if (frappe.user.has_role('SRO') && !frappe.user.has_role('System Manager')) {
            // Hide sidebar and menu
            frm.page.sidebar.hide();
            frm.page.menu.hide();

            const adminFields = [
                'recruitment_status',
                'sponsored',
                'sponsor',
                'modified',
                'modified_by',
                'creation',
                'owner'
                // Add more admin fields as needed
            ];
            const sroFields = [
                'medical', 
                'credential_screening', 
                '32_km', 
                'psyco', 
                'medical_comment', 
                'credential_comment', 
                'candidate_status',
                "score_point",
                "point_category"
            ];
            
            // Hide admin fields
            adminFields.forEach(field => {
                frm.toggle_display(field, false);
            });
            
            // Make all fields readonly except SRO tab fields
            frm.fields.forEach(field => {
                if (!sroFields.includes(field.df.fieldname)) {
                    frm.set_df_property(field.df.fieldname, 'read_only', 1);
                }
            });
        }
    }
});
