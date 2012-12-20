#!/usr/bin/env python
# ==========

from google.appengine.ext import db

import cgi
import issues
import people

# ----------
class Comment(db.Model): 
  creation_date = db.DateTimeProperty(auto_now_add = True)
  body = db.StringProperty()
  creator = db.ReferenceProperty(people.Person)
  issue = db.ReferenceProperty(issues.Issue)
  
# ----------
def new_comment(context):
  creator_id = context['session']['person_id']
  if not creator_id:
    return
    
  creator = people.get(creator_id)
  if not creator:
    return

  issue_id = int(context['request'].get('issue_id'))
  if not issue_id:
    return

  issue = issues.get(issue_id)
  if not issue:
    return
    
  comment = Comment()
  comment.body = cgi.escape(context['request'].get('comment'))
  comment.creator = creator
  comment.issue = issue
  comment.put()
  context['result']['code'] = 'success'  
