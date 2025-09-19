
import frappe
import requests
from frappe import _
from frappe.utils import getdate, format_date

from dotenv import load_dotenv
import os, requests, xmltodict, json, base64

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

from frappe.model.rename_doc import rename_doc
from frappe.utils import cint

load_dotenv()

#bench pip install python-dotenv
api_key = os.getenv('API_KEY')
api_url = os.getenv('API_URL')
api_user = os.getenv('API_USER')
api_org_id = os.getenv('API_ORG_ID')
encryption_key = os.getenv('ENCRYPTION_KEY')
encryption_iv = os.getenv('ENCRYPTION_IV')

@frappe.whitelist()
def validate_nin(nin: str, date_of_birth: str) -> dict:
    """Validate NIN against NIMC API and return encrypted response
    
    Args:
        nin: National Identity Number
        date_of_birth: Date of birth in YYYY-MM-DD format
        
    Returns:
        Encrypted response from NIMC API
    """
    try:
        # Validate inputs
        if not nin or not date_of_birth:
            frappe.throw(_("NIN and Date of Birth are required"))

        # NIMC API configuration 
        headers = {'Content-Type': 'text/xml; charset=utf-8'}
        
        # Create token request template
        token_template = """
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:iden="http://IdentitySearch.nimc/">
                <soapenv:Header/>
                <soapenv:Body>
                    <iden:createTokenString>
                        <username>{username}</username>
                        <password>{password}</password>
                        <orgid>{org_id}</orgid>
                    </iden:createTokenString>
                </soapenv:Body>
            </soapenv:Envelope>
        """
        
        # Format token request with credentials
        create_token = token_template.format(
            username=api_user,
            password=api_key, 
            org_id=api_org_id
        )

        # Get token
        token_response = requests.post(api_url, headers=headers, data=create_token, timeout=10)
        token_response.raise_for_status()
        
        token_dict = xmltodict.parse(token_response.text)
        token = token_dict['S:Envelope']['S:Body']['ns2:createTokenStringResponse']['return']

        # Search NIN template
        search_template = """
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:iden="http://IdentitySearch.nimc/">
                <soapenv:Header/>
                <soapenv:Body>
                    <iden:searchByNIN>
                        <token>{token}</token>
                        <nin>{nin}</nin>
                    </iden:searchByNIN>
                </soapenv:Body>
            </soapenv:Envelope>
        """
        
        # Format search request
        search_request = search_template.format(token=token, nin=nin)
        
        # Get NIN details
        search_response = requests.post(api_url, headers=headers, data=search_request, timeout=10)
        search_response.raise_for_status()
        
        search_dict = xmltodict.parse(search_response.text)
        result = search_dict['S:Envelope']['S:Body']['ns2:searchByNINResponse']['return']

        # Encrypt response
        return [encrypt_response(result), encryption_key, encryption_iv]

    except requests.RequestException as e:
        # frappe.throw(f"Unable to validate nin, please retry...")
        # frappe.local.response["type"] = "redirect"
        # frappe.local.response["location"] = "/drm/recruitment-application-form/new"
        return [encrypt_response(f"Error: {str(e)}"), encryption_key, encryption_iv]
    except Exception as e:
        frappe.throw(_("Error validating NIN"))
        frappe.local.flags.redirect_location = "/drm/recruitment-application-form"

@frappe.whitelist()
def validate_nin_v2(nin: str, date_of_birth: str) -> dict:
    try:
        result2 = {"data":{
            "surname": "Akinkunmi",
            "firstname": "Gbolahan",
            "middlename": "Nasiru",
            "birthdate": "2000-09-17",
            # "photo": result['photo']    
        }}
        # Encrypt response
        return [encrypt_response(result2), encryption_key, encryption_iv]

    except requests.RequestException as e:
       return [encrypt_response(f"Error: {str(e)}"), encryption_key, encryption_iv]
    except Exception as e:
        frappe.throw(_("Error validating NIN"))
        frappe.local.flags.redirect_location = "/drm/recruitment-application-form"

def encrypt_response(response: dict) -> str:
    """Encrypt API response using AES-CBC
    
    Args:
        response: Dictionary response to encrypt
        
    Returns:
        Base64 encoded encrypted string
    """
    # Encryption constants
    IV = encryption_iv
    KEY = encryption_key
    
    # Convert to bytes
    iv = IV.encode('utf-8')
    key = KEY.encode('utf-8')
    
    # Prepare data
    json_data = json.dumps(response)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(json_data.encode()) + padder.finalize()

    # Encrypt
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded_data) + encryptor.finalize()

    # Encode
    return base64.b64encode(encrypted).decode('utf-8')

def encrypt_error_response(response):
    IV = encryption_iv
    KEY = encryption_key
    
    # Convert to bytes
    iv = IV.encode('utf-8')
    key = KEY.encode('utf-8')
    
    # Prepare data
    # json_data = json.dumps(response)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(response) + padder.finalize()

    # Encrypt
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded_data) + encryptor.finalize()

    # Encode
    return base64.b64encode(encrypted).decode('utf-8')
        


@frappe.whitelist()
def custom_rename_doc(doctype, old, new, merge=False):
    return rename_doc(doctype, old, new, merge=cint(merge))