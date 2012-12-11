#!/usr/bin/env python
# ==========
from django.utils import simplejson as json

import util
import twitter

# ----------
def get(request, response, method):
	if util.check_referrer(request, response) == False:
		return
	
	result = {
		"code": "failure"
	}

	if method == "get-twitter-url":
		twitter.get_authorization_url(request, result)
			
	response.headers['Content-Type'] = "application/json"
	response.out.write(json.dumps(result))
