app_name = "armyrecruitment"
app_title = "Armyrecruitment"
app_publisher = "nasirucode"
app_description = "Army recruitment"
app_email = "akingbolahan12@gmail.com"
app_license = "mit"

# Apps
# ------------------
app_logo_url = "/assets/armyrecruitment/image/logo.png"

website_context = {
    "favicon" : "/assets/armyrecruitment/image/logo.png",
    "splash_image" : "/assets/armyrecruitment/image/logo.png",
    "null-state" : "/assets/armyrecruitment/image/logo.png"
}

app_include_css = "/assets/armyrecruitment/css/app.css"
app_include_js = [
    "/assets/armyrecruitment/js/crypto.js",
    "/assets/armyrecruitment/js/drm.js",
    "/assets/armyrecruitment/js/home.js",
    # "/assets/armyrecruitment/frappe/form/controls/attach.js"
]#"/assets/Armyrecruitment/js/Armyrecruitment.js"

# include js, css files in header of web template
web_include_css = ["/assets/armyrecruitment/css/web.css",
                   "/assets/armyrecruitment/font-awesome/css/all.min.css",
                #    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css",
                #    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css",
                   "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Nunito:wght@400;800&family=Sacramento&family=Roboto+Slab:wght@700&display=swap"
                ]
web_include_js = [
    "/assets/armyrecruitment/js/web.js",
    "/assets/armyrecruitment/js/crypto.js",
    "/assets/armyrecruitment/js/home.js",
    # "/assets/armyrecruitment/frappe/form/controls/attach.js"
    # "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"
]

fixtures = [
    "Custom Field",
    "Dashboard Chart",
    "Workspace",
    "DSSC SSC Application Course",
    "Regular Intake Application",
    "Recruitment Setting",
    "Local Government",
    "State",
    "Portal Settings"
    # "Email Account"
    # "User"
]

permission_query_conditions = {
    "Recruitment Application": "armyrecruitment.custom_scripts.recruitment_application_query.recruitment_application_query"
}
# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "armyrecruitment",
# 		"logo": "/assets/armyrecruitment/logo.png",
# 		"title": "Armyrecruitment",
# 		"route": "/armyrecruitment",
# 		"has_permission": "armyrecruitment.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/armyrecruitment/css/armyrecruitment.css"
# app_include_js = "/assets/armyrecruitment/js/armyrecruitment.js"

# include js, css files in header of web template
# web_include_css = "/assets/armyrecruitment/css/armyrecruitment.css"
# web_include_js = "/assets/armyrecruitment/js/armyrecruitment.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "armyrecruitment/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "armyrecruitment/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "armyrecruitment.utils.jinja_methods",
# 	"filters": "armyrecruitment.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "armyrecruitment.install.before_install"
# after_install = "armyrecruitment.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "armyrecruitment.uninstall.before_uninstall"
# after_uninstall = "armyrecruitment.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "armyrecruitment.utils.before_app_install"
# after_app_install = "armyrecruitment.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "armyrecruitment.utils.before_app_uninstall"
# after_app_uninstall = "armyrecruitment.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "armyrecruitment.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"armyrecruitment.tasks.all"
# 	],
# 	"daily": [
# 		"armyrecruitment.tasks.daily"
# 	],
# 	"hourly": [
# 		"armyrecruitment.tasks.hourly"
# 	],
# 	"weekly": [
# 		"armyrecruitment.tasks.weekly"
# 	],
# 	"monthly": [
# 		"armyrecruitment.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "armyrecruitment.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "armyrecruitment.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "armyrecruitment.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["armyrecruitment.utils.before_request"]
# after_request = ["armyrecruitment.utils.after_request"]

# Job Events
# ----------
# before_job = ["armyrecruitment.utils.before_job"]
# after_job = ["armyrecruitment.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"armyrecruitment.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

