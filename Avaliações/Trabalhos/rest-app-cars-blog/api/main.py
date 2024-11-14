from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import jwt
import datetime

from mapper import map_cars, map_countries, map_car_simple, currency_to_float
from database_functions import *

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
SECRET_KEY = 'BAD_SECRET_KEY'

# Helper functions
def set_cors_headers(response):
    """Sets CORS headers for the response."""
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

def create_token_response(payload):
    """Creates a JSON response containing the JWT token."""
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    response = make_response(jsonify({
        'name': payload['name'],
        'email': payload['email'],
        'id': payload['id'],
        "token": token
    }))
    return set_cors_headers(response)

def authenticate_user():
    """Authenticates the user by decoding the JWT token from cookies."""
    token = request.cookies.get("jwt")  # Get JWT from cookies
    if not token:
        return None
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if decoded_data.get("id") is None:
            return None
        return decoded_data
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")

    maybe_user_id = get_user_by_email(email)
    if maybe_user_id is None:
        [_id] = add_user(name, email)
    else:
        _id = maybe_user_id

    payload = {
        'name': name,
        'email': email,
        'id': _id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    return create_token_response(payload), 200

@app.route("/car", methods=["GET"])
def car():
    _id = request.args.get("id")
    if _id is not None:
        try:
            response = make_response(jsonify(map_car_simple(get_car(_id))))
        except:
            response = make_response(jsonify({}))
        return set_cors_headers(response)

    cars = map_cars(get_cars(request.args.get("filter"), request.args.get("filter_type")))
    return set_cors_headers(make_response(jsonify(cars)))

@app.route("/add-car", methods=["POST"])
def add_car():
    decoded_data = authenticate_user()
    if not decoded_data:
        return set_cors_headers(make_response(jsonify({})))

    add_car_fn(
        request.get_json().get('name'),
        request.get_json().get('value'),
        request.get_json().get('color'),
        request.get_json().get('max_speed'),
        request.get_json().get('image_url'),
        request.get_json().get('country_id'),
        decoded_data.get("id")
    )
    return set_cors_headers(make_response(jsonify({})))

@app.route("/put-car", methods=["PUT"])
def put_car():
    decoded_data = authenticate_user()
    if not decoded_data:
        return set_cors_headers(make_response(jsonify({})))

    user_id = decoded_data.get("id")
    if user_id != request.get_json().get("added_by_user_id"):
        return set_cors_headers(make_response(jsonify({})))

    car = map_car_simple(get_car(request.get_json().get("id")))
    put_car_fn(
        request.get_json().get("id"),
        request.get_json().get('name') or car.get("name"),
        request.get_json().get('value') or currency_to_float(car.get('value')),
        request.get_json().get('color') or car.get('color'),
        request.get_json().get('max_speed') or car.get('max_speed'),
        request.get_json().get('image_url') or car.get('image_url'),
        request.get_json().get('country_id') or car.get('country_id'),
        user_id
    )
    return set_cors_headers(make_response(jsonify({})))

@app.route("/delete-car", methods=["DELETE"])
def delete_car():
    decoded_data = authenticate_user()
    if not decoded_data:
        return set_cors_headers(make_response(jsonify({})))

    user_id = decoded_data.get("id")
    if user_id != request.args.get("added_by_user_id"):
        return set_cors_headers(make_response(jsonify({})))

    delete_car_fn(request.args.get("id"))
    return set_cors_headers(make_response(jsonify({})))

@app.route("/country", methods=["GET"])
def country():
    response = make_response(jsonify(map_countries(get_countries())))
    return set_cors_headers(response)

if __name__ == "__main__":
    app.run(port=8080, debug=True)
