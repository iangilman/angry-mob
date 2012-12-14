#!/usr/bin/env python
# ==========

import logging
import os
import webapp2

from django.utils import simplejson as json
from google.appengine.ext.webapp import template
from webapp2_extras import sessions

import api
import people
import session_module
import twitter

# ----------
class MainHandler(session_module.BaseSessionHandler):
  def get(self):
    for_client = {
      'name': self.session.get('name'),
      'username': self.session.get('username')
    }
    
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    template_values = {"for_client": json.dumps(for_client)}
    self.response.out.write(template.render(path, template_values))

# ----------
class LoginHandler(session_module.BaseSessionHandler):
  def get(self):
    self.session['username'] = 'George'
    path = os.path.join(os.path.dirname(__file__), 'login.html')
    self.response.out.write(template.render(path, {}))

# ----------
class LogoutHandler(session_module.BaseSessionHandler):
  def get(self):
    self.session['username'] = None
    path = os.path.join(os.path.dirname(__file__), 'login.html')
    self.response.out.write(template.render(path, {}))

# ----------
class Api(session_module.BaseSessionHandler):
  def get(self, method):
    api.get(method, {
      'request': self.request,
      'response': self.response,
      'session': self.session
    })

  def post(self, method):
    api.get(method, {
      'request': self.request,
      'response': self.response,
      'session': self.session
    })

# ----------
class Twitter(session_module.BaseSessionHandler):
  def get(self):
    auth_token = self.request.get("oauth_token")
    auth_verifier = self.request.get("oauth_verifier")
    
    for_client = {
      "code": "failure"
    }
    
    if auth_token and auth_verifier:
      for_client["code"] = "success"
    
    info = twitter.get_user_info(self.request, auth_token, auth_verifier)
    logging.getLogger().setLevel(logging.DEBUG)
    logging.debug('$$$')
    logging.debug(info)
    
    person = people.get_twitter(info['id'])
    changed = False
    
    if person.name != info['name']:
      person.name = info['name']
      changed = True
      
    if person.username != info['username']:
      person.username = info['username']
      changed = True
      
    if changed:
      person.put()
    
    self.session['twitter_auth_token'] = auth_token
    self.session['twitter_auth_verifier'] = auth_verifier
    self.session['person_id'] = person.key().id()
    for_client['name'] = person.name
    self.session['name'] = person.name
    for_client['username'] = person.username
    self.session['username'] = person.username

    template_values = {
      "for_client": json.dumps(for_client)
    }

    path = os.path.join(os.path.dirname(__file__), 'twitter.html')
    self.response.out.write(template.render(path, template_values))

# ----------
app = webapp2.WSGIApplication([
  ('/api/(.*)', Api), 
  ('/twitter-callback', Twitter),
  ('/login', LoginHandler),
  ('/logout', LogoutHandler),
  ('/.*', MainHandler)
], config = session_module.myconfig_dict, debug = True)
