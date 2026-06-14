# RentRay API Context
- Endpoint: `http://10.42.132.169:8000/analyze-contract/`
- Method: POST
- Payload: `multipart/form-data` containing a `file` (image or pdf).
- Response: JSON containing landlord_name, tenant_name, monthly_rent, lease_start_date, and lease_end_date.