from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

import pandas as pd
from config import dbuser, dbpassword

# Use flask_pymongo to set up mongo connection
app = Flask(__name__)
app.config["MONGO_URI"] = f"mongodb://{dbuser}:{dbpassword}@ds111113.mlab.com:11113/carriers"
mongo = PyMongo(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/google")
def google():
    # Add to Collections in Database
    ga_sum = mongo.db.ga_sum.find()
    # Remove 
    df = pd.DataFrame(list(ga_sum))
    df.drop("_id", axis = 1, inplace = True)
    
    return jsonify(df.to_dict(orient = "records"))

@app.route("/other")
def other():
    return render_template("other.html")


if __name__ == "__main__":
    app.run(debug=True)
