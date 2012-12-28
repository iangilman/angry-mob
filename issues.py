#!/usr/bin/env python
# ==========

from google.appengine.ext import db

import cgi
import people

# ----------
class Issue(db.Model): 
  creation_date = db.DateTimeProperty(auto_now_add = True)
  description = db.StringProperty()
  title = db.StringProperty()
  creator = db.ReferenceProperty(people.Person)
  
# ----------
def get(db_id):
  return Issue.get_by_id(db_id)

# ----------
def new_issue(context):
  creator_id = context['session']['person_id']
  if not creator_id:
    return
    
  creator = people.get(creator_id)
  if not creator:
    return
    
  issue = Issue()
  issue.description = cgi.escape(context['request'].get('description'))
  issue.title = cgi.escape(context['request'].get('title'))
  issue.creator = creator
  issue.put()
  context['result']['id'] = issue.key().id()  
  context['result']['code'] = 'success'  

# ----------
def get_issue(context):
  issue = Issue.get_by_id(int(context['request'].get('id')))
  if not issue:
    return
    
  context['result']['issue'] = {
    'title': issue.title,
    'description': issue.description,
    'creation_date': issue.creation_date.isoformat(),
    'creator': {
      'name': issue.creator.name,
      'id': issue.creator.key().id()
    }
  }

  context['result']['code'] = 'success'

# ----------
def get_issues(context):
  issues = []
  issue_list = db.GqlQuery("SELECT * FROM Issue")
  for issue in issue_list:
    issues.append({
      'title': issue.title,
      'creation_date': issue.creation_date.isoformat(),
      'id': issue.key().id(),
      'creator': {
        'name': issue.creator.name,
        'id': issue.creator.key().id()
      }
    })

  context['result']['issues'] = issues
  context['result']['code'] = 'success'
