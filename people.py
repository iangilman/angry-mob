#!/usr/bin/env python
# ==========

from google.appengine.ext import db

# ----------
class Person(db.Model): 
  creation_date = db.DateTimeProperty(auto_now_add = True)
  twitter_id = db.IntegerProperty()
  name = db.StringProperty()
  username = db.StringProperty()
  
# ----------
def get(db_id):
  return Person.get_by_id(db_id)

# ----------
def get_twitter(twitter_id):
  person = Person.gql("WHERE twitter_id = :1", twitter_id).get()
  if person:
    return person
    
  person = Person()
  person.twitter_id = twitter_id
  person.put()
  return person
