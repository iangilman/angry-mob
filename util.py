#!/usr/bin/env python
# ==========
import logging
import urlparse

# ----------
def check_referrer(request, response):
	# Make sure it's coming from our site
	if (not request.headers.has_key("referer")):
		logging.error("Request has no referrer")
		response.set_status(400) # Bad Request
		return False
		
	us = urlparse.urlparse(request.url)
	them = urlparse.urlparse(request.headers["referer"])
	
	if them.hostname != us.hostname:
		logging.error("Bad referrer: " + them.hostname)
		response.set_status(400) # Bad Request
		return False
		
	return True
