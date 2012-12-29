#!/usr/bin/env python
# ==========

from google.appengine.ext import db

import issues

# ----------
class Tag(db.Model): 
  name = db.StringProperty()
  issue = db.ReferenceProperty(issues.Issue)

# ----------
def get_for_issue(issue):
  result = ''
  tag_list = db.GqlQuery("SELECT * FROM Tag WHERE issue = :1", issue)
  for tag in tag_list:
    result = result + tag.name

  return result
