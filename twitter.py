#!/usr/bin/env python
# ==========
has_keys = True
try:
  import keys
except ImportError:
  has_keys = False
  
import oauth

# ----------
def get_client(request):
  if not has_keys:
    return None
 
  callback_url = "%s/twitter-callback" % request.host_url
  return oauth.TwitterClient(keys.twitter_consumer_key, keys.twitter_consumer_secret,
    callback_url)
  
# ----------
def get_authorization_url(request, result):
  client = get_client(request)
  if not client:
    return
 
  result["url"] = client.get_authorization_url()
  result["code"] = "success"

# ----------
def get_user_info(request, auth_token, auth_verifier):
  client = get_client(request)
  if not client:
    return None
 
  return client.get_user_info(auth_token, auth_verifier=auth_verifier)
