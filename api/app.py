from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'

db = sqlalchemy.SQLAlchemy(app)

#Team post template, will allow logged in user to dynamically add or delete a content post stored in a database
class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	team = db.Column(db.String(64))
	title = db.Column(db.String(64))
	update = db.Column(db.String(2048))

#User class to store and manage access to adding and deleting content buttons
class User(db.Model):
	name = db.Column(db.String(50), primary_key=True)
	password = db.Column(db.String(50))

base_url = '/api/'

# index
#Loads all the given team posts that are currently hidden
#when javascript event is triggered to allow a set of posts to come into view call show team in js,
#those posts will be shown
#called when a certain team is being viewed to show top 5 recent team posts
#loads all posts given a team, count parameter(5 default) and order_by parameter(newest first default) 
#return JSON
#http://localhost:5000/api/posts?team=Attitude - in postman under GET
@app.route(base_url + 'posts', methods=["GET"])
def index():
    team = request.args.get("team", None)
    print(team)
    if team is None:
        return "Must provide team", 500
 
    count = 5
    #query = Post.query.filter_by(team=team).order_by(id).limit(count).all() # store the results of your query here 
    query = Post.query.filter_by(team=team).all()

    result = []
    for row in reversed(query):
        result.append(
            row_to_obj(row) # you must call this function to properly format 
        )

    return jsonify({"status": 1, "posts": result})

# create
# creates a team post given the params
#http://localhost:5000/api/posts/Attitude - in postman POST
@app.route(base_url + 'posts/<string:team>', methods=['POST'])
def create(team):
    post = Post(**request.json)
    db.session.add(post)
    db.session.commit()

    db.session.refresh(post)

    return jsonify({"status": 1, "post": row_to_obj(post)}), 200

#Login
# @app.route(base_url + '/login', methods=['GET'])
# def do_admin_login():
# 	_USERNAME = request.args.get("username", None)
# 	_PASSWORD= request.args.get("password", None)

# 	if _USERNAME == "admin" and _PASSWORD == "password":
# 		return jsonify({"status": 1, "login": {"login": "Success"}})
# 	else:
# 		return jsonify({"status": 0, "login": {"login": "Failure"}})
 
# @app.route("/logout")
# def logout():
#     pass


def row_to_obj(row):
    row = {
            "id": row.id,
            "team": row.team,
            "title": row.title,
            "update": row.update
        }

    return row

  
def main():
	db.create_all() # creates the tables you've provided
	app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()