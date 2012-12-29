#!/usr/bin/env python
# ==========

from google.appengine.ext import db

import cgi
import people

STATUS_OPEN = 1
STATUS_CLOSED = 2

# ----------
class Issue(db.Model): 
  creation_date = db.DateTimeProperty(auto_now_add = True)
  description = db.StringProperty()
  title = db.StringProperty()
  creator = db.ReferenceProperty(people.Person)
  status = db.IntegerProperty(STATUS_OPEN)
  
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
  issue.status = STATUS_OPEN
  issue.put()
  context['result']['id'] = issue.key().id()  
  context['result']['code'] = 'success'  

# ----------
def update_issue(context):
  issue = Issue.get_by_id(int(context['request'].get('id')))
  if not issue:
    return

  creator_id = context['session']['person_id']
  if not creator_id:
    return
    
  if issue.creator.key().id() != creator_id:
    return
    
  description = cgi.escape(context['request'].get('description'))
  if description:
    issue.description = description
    
  title = cgi.escape(context['request'].get('title'))
  if title:
    issue.title = title
    
  status = context['request'].get('status')
  if status:
    issue.status = int(status)
    
  issue.put()
  context['result']['issue'] = as_dictionary(issue, True) 
  context['result']['code'] = 'success'  

# ----------
def get_issues(context):
  issues = []
  issue_list = db.GqlQuery("SELECT * FROM Issue")
  for issue in issue_list:
    issues.append(as_dictionary(issue))

  context['result']['issues'] = issues
  context['result']['code'] = 'success'

# ----------
def as_dictionary(issue, include_description = False):
  result = {
    'title': issue.title,
    'creation_date': issue.creation_date.isoformat(),
    'id': issue.key().id(),
    'status': issue.status,
    'creator': {
      'name': issue.creator.name,
      'id': issue.creator.key().id()
    }
  }
  
  if include_description:
    result['description'] = issue.description
    
  if not result['status']:
    result['status'] = STATUS_OPEN
    
  return result
