frappe.listview_settings['Recruitment Application'] = { 
    onload: function(listview) { 
        if (frappe.user.has_role('SRO') && !frappe.user.has_role('System Manager')) { 
            // Hide sidebar $('.list-sidebar').hide();
             // Hide menu items
            $('.page-head .page-actions').hide();
            $('.menu-btn-group').hide();
            
            // Hide standard list view buttons
            $('.filter-selector').hide();
            $('.sort-selector').hide();
            $('.list-row-right').hide();
            $('.layout-side-section').hide();
            $('.sidebar-toggle-btn').hide();
        }
    }
};