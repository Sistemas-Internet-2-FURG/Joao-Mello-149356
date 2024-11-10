from flask import Flask, request, jsonify
from flask_cors import CORS
from mapper import map_cars, map_countries, map_car_simple, currency_to_float
from database_functions import *
import jwt
import datetime

app = Flask(__name__)
CORS(app)
SECRET_KEY = 'BAD_SECRET_KEY'


@app.route("/login",methods=["POST"])
def login():
    maybe_user_id = get_user_by_email(request.get_json().get("email"))
    # Persist user on database if not exists
    if maybe_user_id is None: 
        [_id] = add_user(request.get_json().get("name"), request.get_json().get("email"))
    
    name = request.get_json().get("name")
    email = request.get_json().get("email")
    _id = maybe_user_id or _id

    payload = {
        'name': name,
        'email': email,
        'id': _id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiration time (1 hour)
    }

    # Encode the payload to create the JWT token
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    
    # Return the token as a JSON response
    return jsonify({
        'name': name,
        'email': email,
        'id': _id,
        "token": token
    }), 200

@app.route("/car", methods=["GET"])
def car():
    # Get filters selected by user and persist on template after filter submission
    _filter = request.args.get("filter")
    filter_type = request.args.get("filter_type")
    _id = request.args.get("id")

    if _id is not None:
        try:
            return jsonify(map_car_simple(get_car(_id)))
        except: 
            return jsonify({})

    cars = map_cars(get_cars(_filter, filter_type))
    return jsonify(cars)


@app.route("/add-car", methods=["POST"])
def add_car():
    # Only users with session can add cars
    try:
        decoded_data = jwt.decode(request.headers.get("authorization").replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
    except Exception:
        return jsonify({})
    
    if decoded_data.get("id") is None:
        return jsonify({})
    
    # Add car to database, binded to current user session
    add_car_fn(
        request.get_json().get('name'),
        request.get_json().get('value'),
        request.get_json().get('color'),
        request.get_json().get('max_speed'),
        request.get_json().get('image_url'),
        request.get_json().get('country_id'),
        decoded_data.get("id")
    )

    return jsonify({})


@app.route("/put-car", methods=["PUT"])
def put_car():
    # Only users with session can add cars
    try:
        decoded_data = jwt.decode(request.headers.get("authorization").replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
    except Exception:
        return jsonify({})
    
    # Only users with session can add cars
    if decoded_data.get("id") is None:
        return jsonify({})

    # Only user that registerd the car can edit it
    if decoded_data.get("id") != request.get_json().get("added_by_user_id"):
        return jsonify({})
    
    # Put car to database, binded to current user session
    # We get values from form. If user has not changed a given field, we overwrite with the database value
    car = map_car_simple(get_car(request.get_json().get("id")))

    put_car_fn(
        request.get_json().get("id"),
        request.get_json().get('name') or car.get("name"),
        request.get_json().get('value') or currency_to_float(car.get('value')), # car.get('value') return a value to display (R$ 100,00), we need float
        request.get_json().get('color') or car.get('color'),
        request.get_json().get('max_speed') or car.get('max_speed'),
        request.get_json().get('image_url') or car.get('image_url'),
        request.get_json().get('country_id') or car.get('country_id'),
        request.get_json().get('added_by_user_id') or car.get('added_by_user_id'),
    )

    return jsonify({})


@app.route("/delete-car", methods=["DELETE"])
def delete_car():
    # Only users with session can add cars
    try:
        decoded_data = jwt.decode(request.headers.get("authorization").replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
    except Exception:
        return jsonify({})
    
    # Only users with session can delete cars
    if decoded_data.get("id") is None:
        return jsonify({})

    # Only user that registerd the car can edit it 
    if decoded_data.get("id") != request.args.get("added_by_user_id"):
        return jsonify({})
    
    delete_car_fn(request.args.get("id"))
    return jsonify({})

@app.route("/country", methods=["GET"])
def country():
    return jsonify(map_countries(get_countries()))


if __name__ == "__main__":
    app.run(port=8080, debug=True)