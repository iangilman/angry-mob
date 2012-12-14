#!/usr/bin/env python
# ==========

from google.appengine.ext import db

import people

# ----------
class Issue(db.Model): 
  creation_date = db.DateTimeProperty(auto_now_add = True)
  description = db.StringProperty()
  title = db.StringProperty()
  creator = db.ReferenceProperty(people.Person)
  
# ----------
def new_issue(context):
  creator_id = context['session']['person_id']
  if not creator_id:
    return
    
  creator = people.get(creator_id)
  if not creator:
    return
    
  issue = Issue()
  issue.description = context['request'].get('description')
  issue.title = context['request'].get('title')
  issue.creator = creator
  issue.put()

# ----------
def get_issues(context):
  issues = []
  issue_list = db.GqlQuery("SELECT * FROM Issue")
  for issue in issue_list:
    issues.append({
      'title': issue.title,
      'description': issue.description,
      'id': issue.key().id()
    })

  context['result']['issues'] = issues